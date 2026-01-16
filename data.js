const rawTriples = [
    // Judy Hopps
    { s: 'ex:JudyHopps', p: 'rdf:type', o: 'foaf:Person' },
    { s: 'ex:JudyHopps', p: 'foaf:name', o: '"주디 홉스"' },
    { s: 'ex:JudyHopps', p: 'ex:role', o: 'ex:PoliceOfficer' },
    { s: 'ex:JudyHopps', p: 'ex:partner', o: 'ex:NickWilde' },
    { s: 'ex:JudyHopps', p: 'ex:boss', o: 'ex:ChiefBogo' },
    { s: 'ex:JudyHopps', p: 'ex:investigates', o: 'ex:Event_MysteriousDisappearance' },

    // Nick Wilde
    { s: 'ex:NickWilde', p: 'rdf:type', o: 'foaf:Person' },
    { s: 'ex:NickWilde', p: 'foaf:name', o: '"닉 와일드"' },
    { s: 'ex:NickWilde', p: 'ex:role', o: 'ex:PoliceOfficer' },
    { s: 'ex:NickWilde', p: 'ex:partner', o: 'ex:JudyHopps' },
    { s: 'ex:NickWilde', p: 'ex:formerRole', o: 'ex:ConArtist' },
    { s: 'ex:NickWilde', p: 'ex:investigates', o: 'ex:Event_MysteriousDisappearance' },

    // Chief Bogo
    { s: 'ex:ChiefBogo', p: 'rdf:type', o: 'foaf:Person' },
    { s: 'ex:ChiefBogo', p: 'foaf:name', o: '"보고 서장"' },
    { s: 'ex:ChiefBogo', p: 'ex:role', o: 'ex:PoliceChief' },
    { s: 'ex:ChiefBogo', p: 'ex:commands', o: 'ex:JudyHopps' },
    { s: 'ex:ChiefBogo', p: 'ex:commands', o: 'ex:NickWilde' },

    // Clawhauser
    { s: 'ex:Clawhauser', p: 'rdf:type', o: 'foaf:Person' },
    { s: 'ex:Clawhauser', p: 'foaf:name', o: '"클로하우저"' },
    { s: 'ex:Clawhauser', p: 'ex:role', o: 'ex:DeskSergeant' },
    { s: 'ex:Clawhauser', p: 'ex:likes', o: '"도넛"' },
    { s: 'ex:Clawhauser', p: 'ex:allyOf', o: 'ex:JudyHopps' },

    // Mr Big
    { s: 'ex:MrBig', p: 'rdf:type', o: 'foaf:Person' },
    { s: 'ex:MrBig', p: 'foaf:name', o: '"미스터 빅"' },
    { s: 'ex:MrBig', p: 'ex:role', o: 'ex:MafiaBoss' },
    { s: 'ex:MrBig', p: 'ex:helps', o: 'ex:JudyHopps' },

    // New Villain
    { s: 'ex:NewVillain', p: 'rdf:type', o: 'foaf:Person' },
    { s: 'ex:NewVillain', p: 'foaf:name', o: '"수상한 그림자"' },
    { s: 'ex:NewVillain', p: 'ex:role', o: 'ex:Villain' },
    { s: 'ex:NewVillain', p: 'ex:antagonistOf', o: 'ex:JudyHopps' },
    { s: 'ex:NewVillain', p: 'ex:antagonistOf', o: 'ex:NickWilde' },

    // Occupations
    { s: 'ex:PoliceOfficer', p: 'rdf:type', o: 'ex:Occupation' },
    { s: 'ex:PoliceOfficer', p: 'label', o: '"경찰관"' },
    { s: 'ex:PoliceChief', p: 'rdf:type', o: 'ex:Occupation' },
    { s: 'ex:PoliceChief', p: 'label', o: '"경찰 서장"' },
    { s: 'ex:DeskSergeant', p: 'rdf:type', o: 'ex:Occupation' },
    { s: 'ex:DeskSergeant', p: 'label', o: '"민원 담당"' },
    { s: 'ex:MafiaBoss', p: 'rdf:type', o: 'ex:Occupation' },
    { s: 'ex:MafiaBoss', p: 'label', o: '"마피아 보스"' },
    { s: 'ex:Villain', p: 'rdf:type', o: 'ex:Occupation' },
    { s: 'ex:Villain', p: 'label', o: '"악당"' },
    { s: 'ex:ConArtist', p: 'rdf:type', o: 'ex:Occupation' },
    { s: 'ex:ConArtist', p: 'label', o: '"사기꾼"' },

    // Events
    { s: 'ex:Event_MysteriousDisappearance', p: 'rdf:type', o: 'ex:Event' },
    { s: 'ex:Event_MysteriousDisappearance', p: 'ex:eventName', o: '"미스터리 실종 사건"' },
    { s: 'ex:Event_MysteriousDisappearance', p: 'ex:involves', o: 'ex:JudyHopps' },
    { s: 'ex:Event_MysteriousDisappearance', p: 'ex:involves', o: 'ex:NickWilde' },
    { s: 'ex:Event_MysteriousDisappearance', p: 'ex:location', o: 'ex:ZootopiaCity' },

    { s: 'ex:Event_ChaseInRainforest', p: 'rdf:type', o: 'ex:Event' },
    { s: 'ex:Event_ChaseInRainforest', p: 'ex:eventName', o: '"열대우림 추격전"' },
    { s: 'ex:Event_ChaseInRainforest', p: 'ex:involves', o: 'ex:JudyHopps' },
    { s: 'ex:Event_ChaseInRainforest', p: 'ex:involves', o: 'ex:NewVillain' },
    { s: 'ex:Event_ChaseInRainforest', p: 'ex:leadsTo', o: 'ex:ClueDiscovery' },

     { s: 'ex:Event_Undercover', p: 'rdf:type', o: 'ex:Event' },
    { s: 'ex:Event_Undercover', p: 'ex:eventName', o: '"잠입 수사"' },
    { s: 'ex:Event_Undercover', p: 'ex:involves', o: 'ex:NickWilde' },
    { s: 'ex:Event_Undercover', p: 'ex:risks', o: 'ex:Danger' },

    // Locations
    { s: 'ex:ZootopiaCity', p: 'rdf:type', o: 'ex:Location' },
    { s: 'ex:ZootopiaCity', p: 'ex:placeName', o: '"주토피아"' },
    
    { s: 'ex:RainforestDistrict', p: 'rdf:type', o: 'ex:Location' },
    { s: 'ex:RainforestDistrict', p: 'ex:placeName', o: '"열대우림 구역"' }
];
