document.addEventListener('DOMContentLoaded', () => {
    initGraph();
    initChatbot();
});

let network;
let nodesDataset;
let edgesDataset;
let nodeMap = {}; // Map of ID -> Node Data
let labelMap = {}; // Map of Label -> ID (for search)

// Helper for random array element
function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function initGraph() {
    // 1. Process Triples to Build Graph Data
    const nodes = [];
    const edges = [];

    // First pass: Identify Nodes and their attributes
    rawTriples.forEach(triple => {
        const s = triple.s;

        if (!nodeMap[s]) {
            nodeMap[s] = { id: s, label: s.replace('ex:', ''), type: 'Unknown', props: {} };
        }

        // Handle Properties
        if (triple.p === 'rdf:type') {
            nodeMap[s].type = triple.o.replace('foaf:', '').replace('ex:', '');
        } else if (triple.p === 'foaf:name' || triple.p === 'ex:eventName' || triple.p === 'ex:outcomeName' || triple.p === 'ex:eraName') {
            const label = triple.o.replace(/"/g, '');
            nodeMap[s].label = label;
            nodeMap[s].props[triple.p] = label;
            labelMap[label] = s;
        } else if (triple.p === 'label') {
            const label = triple.o.replace(/"/g, '');
            nodeMap[s].label = label;
            labelMap[label] = s;
        } else {
            // Store other properties
            if (!nodeMap[s].props[triple.p]) {
                nodeMap[s].props[triple.p] = [];
            }
            nodeMap[s].props[triple.p].push(triple.o);
        }
    });

    // Ensure Objects that are URIs are also nodes
    rawTriples.forEach(triple => {
        const o = triple.o;
        if (o.startsWith('ex:') && !nodeMap[o]) {
            nodeMap[o] = { id: o, label: o.replace('ex:', ''), type: 'Unknown', props: {} };
            labelMap[nodeMap[o].label] = o;
        }
    });

    // 2. Create Vis.js Nodes
    Object.values(nodeMap).forEach(node => {
        let color = '#DDD';
        let shape = 'ellipse';
        let size = 25;

        switch (node.type) {
            case 'Person':
                color = '#FFB84C'; // Yellow
                shape = 'dot'; // Circular
                size = 30;
                break;
            case 'Event':
                color = '#F16767'; // Red
                shape = 'diamond';
                size = 25;
                break;
            case 'Occupation':
                color = '#A459D1'; // Purple
                shape = 'box';
                break;
            case 'Location':
                color = '#2E8B57'; // SeaGreen
                shape = 'box';
                break;
            case 'Outcome':
                color = '#33cc33'; // Green
                shape = 'star';
                break;
            default:
                color = '#87CEEB'; // Blue
        }

        nodes.push({
            id: node.id,
            label: node.label,
            color: { background: color, border: '#333' },
            font: { face: 'Jua', size: 16, color: '#333' },
            shape: shape,
            size: size,
            borderWidth: 2
        });
    });

    // 3. Create Vis.js Edges
    rawTriples.forEach(triple => {
        const s = triple.s;
        const p = triple.p;
        const o = triple.o;

        if (p === 'rdf:type' || p === 'foaf:name' || p.endsWith('Name') || p === 'label') return;

        if (o.startsWith('ex:')) {
            let label = p.replace('ex:', '');

            const predicateMap = {
                'role': '직업',
                'partner': '파트너',
                'boss': '상사',
                'commands': '지휘',
                'likes': '좋아함',
                'allyOf': '조력자',
                'helps': '도움',
                'antagonistOf': '적대',
                'investigates': '수사',
                'location': '장소',
                'leadsTo': '연결',
                'risks': '위험',
                'involves': '관련',
                'causeBy': '원인'
            };

            if (predicateMap[label]) label = predicateMap[label];

            edges.push({
                from: s,
                to: o,
                label: label,
                arrows: 'to',
                font: { align: 'middle', size: 12, face: 'Nanum Gothic' },
                color: { color: '#888' },
                smooth: { type: 'curvedCW', roundness: 0.2 }
            });
        }
    });

    // 4. Initialize Network
    const container = document.getElementById('graph-container');
    const data = { nodes: nodes, edges: edges };
    const options = {
        physics: {
            stabilization: false,
            barnesHut: {
                gravitationalConstant: -3000,
                springConstant: 0.4,
                springLength: 150
            }
        },
        interaction: {
            hover: true,
            zoomView: true
        }
    };

    network = new vis.Network(container, data, options);

    network.on("click", function (params) {
        if (params.nodes.length > 0) {
            const nodeId = params.nodes[0];
            const node = nodeMap[nodeId];

            // Varied greeting
            const greetings = [
                `'${node.label}'에 대해 뭘 알려줄까?`,
                `'${node.label}' 친구가 궁금하구나?`,
                `'${node.label}'에 대해 척척박사가 다 알려줄게!`
            ];
            addBotMessage(getRandomItem(greetings));
        }
    });
}

function initChatbot() {
    const inputField = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    function handleSend() {
        const text = inputField.value.trim();
        if (text) {
            addUserMessage(text);
            processUserQuery(text);
            inputField.value = '';
        }
    }

    sendBtn.addEventListener('click', handleSend);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
}

function addUserMessage(text) {
    const chatHistory = document.getElementById('chat-history');
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message user-message';
    msgDiv.innerText = text;
    chatHistory.appendChild(msgDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function addBotMessage(text) {
    const chatHistory = document.getElementById('chat-history');
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message bot-message';
    msgDiv.innerHTML = text;
    chatHistory.appendChild(msgDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function processUserQuery(text) {
    let foundEntities = [];

    // Find all mentioned entities
    for (const [label, id] of Object.entries(labelMap)) {
        if (text.includes(label)) {
            foundEntities.push({ label, id });
        }
    }

    if (foundEntities.length === 0) {
        const confusedMsgs = [
            "으음, 내가 모르는 이름인가봐. 주디나 닉처럼 이름을 정확히 말해줄래?",
            "미안해, 누굴 말하는지 잘 모르겠어. 그래프에 있는 이름을 찾아봐 줘!",
            "척척박사가 잠깐 헷갈렸어. 다시 한번 이름을 크게(정확하게) 말해줄래?"
        ];
        setTimeout(() => addBotMessage(getRandomItem(confusedMsgs)), 500);
        return;
    }

    // Use the first mentioned entity for now
    const target = foundEntities[0];
    const nodeData = nodeMap[target.id];

    // Focus camera
    if (network && target.id) {
        network.focus(target.id, { scale: 1.2, animation: true });
        network.selectNodes([target.id]);
    }

    let response = "";

    // 1. Identify Intent (Keyword checks for kids)
    const isWho = text.includes("누구") || text.includes("소개") || text.includes("뭐야") || text.includes("알려줘") || text.endsWith("니?") || text.endsWith("야?");
    const isJob = text.includes("직업") || text.includes("일") || text.includes("뭐해");
    const isPartner = text.includes("파트너") || text.includes("짝꿍") || text.includes("친구");
    const isEvent = nodeData.type === 'Event'; // Implicit logic for events

    // Helper to get connected node labels
    const getPropLabel = (propName) => {
        const triples = rawTriples.filter(t => t.s === target.id && t.p === propName);
        return triples.map(t => nodeMap[t.o].label);
    };

    if (isJob) {
        const roles = getPropLabel('ex:role');
        if (roles.length > 0) {
            const jobAnswers = [
                `${target.label}의 직업은 <strong>${roles.join(', ')}</strong>이야.`,
                `주토피아에서 <strong>${roles.join(', ')}</strong>으로 활약하고 있어.`
            ];
            response = getRandomItem(jobAnswers);
        } else {
            response = "딱히 정해진 직업은 안 보여.";
        }
    }
    else if (isPartner) {
        const partners = getPropLabel('ex:partner');
        if (partners.length > 0) {
            response = `${target.label}의 최고의 파트너는 바로 <strong>${partners.join(', ')}</strong>이지!`;
        } else {
            response = "파트너 정보는 찾을 수 없어.";
        }
    }
    else if (isEvent) {
        // Explain event
        const involves = getPropLabel('ex:involves');
        response = `<strong>${target.label}</strong> 사건이구나! `;
        if (involves.length > 0) response += `<strong>${involves.join(', ')}</strong>이(가) 관련된 흥미진진한 일이야.`;
    }
    else {
        // Default: "Who/Intro"
        if (target.label === "주디 홉스") {
            response = `<strong>주디 홉스</strong>는 주토피아 최초의 토끼 경찰관이야! <br>
            작지만 용감하고 정의로운 마음을 가졌어. 닉과 함께 사건을 해결한단다.`;
        } else if (target.label === "닉 와일드") {
            response = `<strong>닉 와일드</strong>는 말재주가 좋은 여우야. <br>
            처음엔 사기꾼이었지만 지금은 주디와 함께 훌륭한 경찰관이 되었지!`;
        } else {
            let desc = `<strong>${target.label}</strong>님은 `;
            if (nodeData.type === 'Person') desc += "주토피아의 중요한 주민이야.";
            else if (nodeData.type === 'Occupation') desc += "주토피아의 다양한 직업 중 하나야.";
            else desc += "우리 이야기에 나오는 거야.";

            const roles = getPropLabel('ex:role');
            if (roles.length > 0) {
                desc += `<br>주로 <strong>${roles.join(', ')}</strong>으로 활약했어.`;
            }
            response = desc;
        }
    }

    setTimeout(() => {
        addBotMessage(response);
    }, 500);
}
