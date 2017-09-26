"use strict"

$(document).ready(function() {
    var instance = Split(['#visualization', '#text'], {
        sizes: [60, 40],
        minSize: 500,
        onDrag: function() {

            initializeCharts();
        }
    });

    $('#tabs, #data-tabs').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    })

    var textClosed = false;

    /*$('#collapse-text-button').click(function(event) {
        event.preventDefault();
        initializeCharts();

        if(textClosed) {
            instance.setSizes([60, 40]);
            textClosed = false;
            $(this).html('&raquo;');
        } else {
            instance.collapse(1);
            textClosed = true;
            $(this).html('&laquo;');
        }
    });*/

    let chapter = {
       "id": 0,
       "name": "TOPICS Of Topicsentertainment blablablablabla blaglablabla oashdiashpdhpasidhipashdpasihd",
       "children": [{
           "id": 1,
           "name": "Topic A",
           "children": [{
               "id": 2,
               "name": "Sub A1",
               "children": [{
                   "id": 3,
                   "name": "Sub A1.1",
                   "children": [{
                       "id": 4,
                       "name": "Sub A1.1.1",
                       "size": 3.374
                   }]
               }, {
                   "id": 5,
                   "name": "Sub A1.2",
                   "children": [{
                       "id": 6,
                       "name": "Sub A1.2.1",
                       "size": 3.374
                   }, {
                       "id": 7,
                       "name": "Sub A1.2.2",
                       "size": 3.375
                   }]
               }, {
                   "id": 8,
                   "name": "Sub A1.3",
                   "size": 4.49
               }, {
                   "id": 9,
                   "name": "Sub A1.4",
                   "size": 4.5
               }, {
                   "id": 10,
                   "name": "Sub A1.5",
                   "size": 5.624
               }]
           }, {
               "id": 11,
               "name": "Sub A2",
               "size": 5.625
           }, {
               "id": 12,
               "name": "Sub A3",
               "children": [{
                   "id": 13,
                   "name": "Sub A3.1",
                   "size": 0.4
               }, {
                   "id": 14,
                   "name": "Sub A3.2",
                   "size": 2.9
               }]
           }, {
               "id": 15,
               "name": "Sub A4",
               "size": 1
           }]
       }, {
           "id": 16,
           "name": "Topic BBBBBBBBBBBBB",
           "children": [{
               "id": 17,
               "name": "Sub B1",
               "size": 3
           }, {
               "id": 18,
               "name": "Sub B2",
               "size": 3
           }, {
               "id": 19,
               "name": "Sub B3",
               "children": [{
                   "id": 20,
                   "name": "Sub A1.1.1",
                   "size": 1
               }, {
                   "id": 21,
                   "name": "Sub A1.1.2",
                   "size": 1.5
               }]
           }]
       }, {
           "id": 22,
           "name": "Topic C",
           "children": [{
               "id": 23,
               "name": "Sub C1",
               "size": 4
           }, {
               "id": 24,
               "name": "Sub C2",
               "children": [{
                   "id": 25,
                   "name": "Sub C2.1",
                   "size": 0.5
               }, {
                   "id": 26,
                   "name": "Sub C2.2",
                   "children": [{
                       "id": 27,
                       "name": "Sub C2.2.1",
                       "size": 0.5
                   }, {
                       "id": 28,
                       "name": "Sub C2.2.2",
                       "size": 0.9
                   }]
               }]
           }]
       }, {
           "id": 29,
           "name": "Topic D",
           "size": 2.6
       }, {
           "id": 30,
           "name": "Topic E",
           "children": [{
               "id": 31,
               "name": "Sub E1",
               "size": 4
           }, {
               "id": 32,
               "name": "Sub E2",
               "children": [{
                   "id": 33,
                   "name": "Sub E2.1",
                   "size": 0.5
               }, {
                   "id": 34,
                   "name": "Sub E2.2",
                   "children": [{
                       "id": 35,
                       "name": "Sub E2.2.1",
                       "size": 0.5
                   }, {
                       "id": 36,
                       "name": "Sub E2.2.2",
                       "size": 0.9
                   }]
               }]
           }]
       }]
    };

    const bubbleData = [
        {
            "_id": "59bf0571c593bfba60354dbf",
            "size": 3,
            "name": "Ola Payne"
        },
        {
            "_id": "59bf0571b4e341a4a08f364f",
            "size": 9,
            "name": "Antoinette Porter"
        },
        {
            "_id": "59bf0571c07052b63344d404",
            "size": 2,
            "name": "Welch Prince"
        },
        {
            "_id": "59bf05714a7443062ae527d9",
            "size": 1,
            "name": "Wolf Guerrero"
        },
        {
            "_id": "59bf05715775f72d3cd19200",
            "size": 6,
            "name": "Katharine Schmidt"
        },
        {
            "_id": "59bf0571fc0809b7a2d2a01a",
            "size": 5,
            "name": "Hollie Blackburn"
        },
        {
            "_id": "59bf05714e69fa86d65e4927",
            "size": 4,
            "name": "Lester Slater"
        },
        {
            "_id": "59bf05717f534bf9a2e763a5",
            "size": 3,
            "name": "Naomi Mejia"
        },
        {
            "_id": "59bf0571f612520675221187",
            "size": 2,
            "name": "Harriett Baldwin"
        },
        {
            "_id": "59bf0571c514573ab223549f",
            "size": 1,
            "name": "Snow Melton"
        },
        {
            "_id": "59bf0571927e9e499790678b",
            "size": 4,
            "name": "Barr Wood"
        },
        {
            "_id": "59bf05714a32ef659614597d",
            "size": 5,
            "name": "Cristina Harris"
        },
        {
            "_id": "59bf057135c13c5721ff9960",
            "size": 8,
            "name": "Valerie Drake"
        },
        {
            "_id": "59bf0571ba40ac4152f29d30",
            "size": 3,
            "name": "Jamie Fields"
        },
        {
            "_id": "59bf0571a3b91eb89479b635",
            "size": 9,
            "name": "Deleon Vang"
        },
        {
            "_id": "59bf0571bd47510e334889e2",
            "size": 2,
            "name": "Elizabeth Durham"
        },
        {
            "_id": "59bf057193de39056214310b",
            "size": 3,
            "name": "Erickson Greene"
        },
        {
            "_id": "59bf0571c8a623d3508bb7f5",
            "size": 2,
            "name": "Kirsten Snider"
        },
        {
            "_id": "59bf0571d70f7268f0b59e18",
            "size": 4,
            "name": "Glass Curry"
        },
        {
            "_id": "59bf0571928b26cf436bbcec",
            "size": 10,
            "name": "Alice Hamilton"
        },
        {
            "_id": "59bf05717c7671f7ba433baa",
            "size": 4,
            "name": "Isabelle Albert"
        },
        {
            "_id": "59bf05718e673d52edb7100f",
            "size": 8,
            "name": "Rhoda Miranda"
        },
        {
            "_id": "59bf05710aa55774a578f9c0",
            "size": 8,
            "name": "Farrell Hodge"
        },
        {
            "_id": "59bf05712a55b806caa44145",
            "size": 1,
            "name": "Blake Frazier"
        },
        {
            "_id": "59bf0571ded13cbaa3566333",
            "size": 6,
            "name": "Betty Hull"
        },
        {
            "_id": "59bf057146e3681b4a6b1c68",
            "size": 4,
            "name": "Jerri Torres"
        },
        {
            "_id": "59bf0571dc65b246cc3e0522",
            "size": 3,
            "name": "Mclean Holcomb"
        },
        {
            "_id": "59bf0571ae1d312ab5b890b3",
            "size": 7,
            "name": "Koch Mathews"
        },
        {
            "_id": "59bf05710155ed7b0ac15afc",
            "size": 1,
            "name": "Francis Bernard"
        },
        {
            "_id": "59bf0571c32dc701146a7930",
            "size": 2,
            "name": "Randolph Sherman"
        },
        {
            "_id": "59bf05712258f4ff4296d09c",
            "size": 2,
            "name": "Grant Jenkins"
        },
        {
            "_id": "59bf05710bee082972f1f318",
            "size": 9,
            "name": "Flowers Hunt"
        },
        {
            "_id": "59bf0571586e6be01472c7df",
            "size": 10,
            "name": "Sonja Perez"
        },
        {
            "_id": "59bf05715b2652cf76bfba7b",
            "size": 8,
            "name": "Richardson Fowler"
        },
        {
            "_id": "59bf0571b11c7a1ae45e7a2b",
            "size": 5,
            "name": "Porter Bishop"
        },
        {
            "_id": "59bf057121b99c6706c06ecf",
            "size": 5,
            "name": "Jeanie Lynn"
        },
        {
            "_id": "59bf05716add9740534adfe1",
            "size": 6,
            "name": "Meredith Castaneda"
        },
        {
            "_id": "59bf0571eaa0e005afbf41b4",
            "size": 6,
            "name": "Cheri Coleman"
        },
        {
            "_id": "59bf05711c7710aa42f738f2",
            "size": 2,
            "name": "Mercado Forbes"
        },
        {
            "_id": "59bf0571032acd85004dfe1b",
            "size": 5,
            "name": "Collins Rodriquez"
        },
        {
            "_id": "59bf05718b8eccea6a445899",
            "size": 9,
            "name": "Keisha Logan"
        },
        {
            "_id": "59bf0571a78972cc5d10276e",
            "size": 3,
            "name": "Sampson Richards"
        },
        {
            "_id": "59bf0571cfb76b2e9bb61f84",
            "size": 4,
            "name": "Ethel Bradford"
        },
        {
            "_id": "59bf0571d8bbaa91358e1041",
            "size": 9,
            "name": "Bonner Price"
        },
        {
            "_id": "59bf0571a2334aba1d63582a",
            "size": 3,
            "name": "Shepard Mccarthy"
        },
        {
            "_id": "59bf0571d069c3900c39e016",
            "size": 5,
            "name": "Reid Acevedo"
        },
        {
            "_id": "59bf0571c4016338ee1840ff",
            "size": 1,
            "name": "Kaufman Silva"
        },
        {
            "_id": "59bf05719f592cdcbc210833",
            "size": 5,
            "name": "Millie Whitley"
        },
        {
            "_id": "59bf057193b13410517b6f7f",
            "size": 7,
            "name": "Vasquez Hebert"
        },
        {
            "_id": "59bf057128478ffbd723115d",
            "size": 6,
            "name": "Ruby Stewart"
        },
        {
            "_id": "59bf0571e9e6de4399524d16",
            "size": 8,
            "name": "Mccray Daugherty"
        },
        {
            "_id": "59bf05715ea7e5ce2f0da7e2",
            "size": 5,
            "name": "Tamara Martin"
        },
        {
            "_id": "59bf0571deac34b9b0776876",
            "size": 5,
            "name": "Marisol Humphrey"
        },
        {
            "_id": "59bf0571716124eabc55e75e",
            "size": 6,
            "name": "Curry Russell"
        },
        {
            "_id": "59bf05710e884d9376742b2a",
            "size": 2,
            "name": "Deena Hall"
        },
        {
            "_id": "59bf0571308cb3894c0f932a",
            "size": 8,
            "name": "Foster Young"
        },
        {
            "_id": "59bf0571dc54923f7efe8ecb",
            "size": 8,
            "name": "Briana Eaton"
        },
        {
            "_id": "59bf0571c367fb52028847d0",
            "size": 7,
            "name": "Tabatha Lambert"
        },
        {
            "_id": "59bf0571589c225a38a90010",
            "size": 9,
            "name": "Alexandra Sweet"
        },
        {
            "_id": "59bf05712762befb5ad15568",
            "size": 4,
            "name": "Annabelle Chaney"
        },
        {
            "_id": "59bf0571f4dcfeba93de22b4",
            "size": 3,
            "name": "Brianna Cox"
        },
        {
            "_id": "59bf0571e009dfc01a5bd97b",
            "size": 8,
            "name": "Carson Lucas"
        },
        {
            "_id": "59bf057152412fdbd693b58e",
            "size": 2,
            "name": "Beth Thompson"
        },
        {
            "_id": "59bf057152508dd3d09cfa9d",
            "size": 8,
            "name": "Nikki Wooten"
        },
        {
            "_id": "59bf0571040e0668c629e814",
            "size": 9,
            "name": "Claire Bowers"
        },
        {
            "_id": "59bf0571d60b283fad4fe665",
            "size": 4,
            "name": "Morin Ochoa"
        },
        {
            "_id": "59bf05716907682dd71bcca8",
            "size": 6,
            "name": "Coleman Becker"
        },
        {
            "_id": "59bf0571e8313435ad16e9f1",
            "size": 10,
            "name": "Jenkins Phelps"
        },
        {
            "_id": "59bf0571a1f7d646c2e45128",
            "size": 5,
            "name": "Gallegos Mooney"
        },
        {
            "_id": "59bf05711d50fb63765af6ba",
            "size": 9,
            "name": "Jaime Randall"
        },
        {
            "_id": "59bf0571ce7ded1c784ddff0",
            "size": 5,
            "name": "Stout Blake"
        },
        {
            "_id": "59bf05718234f25c13df569c",
            "size": 4,
            "name": "Aida Horne"
        },
        {
            "_id": "59bf0571824e1fb315e3299a",
            "size": 2,
            "name": "Arline Pugh"
        },
        {
            "_id": "59bf05711793a49cb53d0f90",
            "size": 10,
            "name": "Norris Mathis"
        },
        {
            "_id": "59bf0571db184a27d9145583",
            "size": 10,
            "name": "Rosa Wilkinson"
        },
        {
            "_id": "59bf05715e27ac071f258258",
            "size": 1,
            "name": "Adele Dennis"
        },
        {
            "_id": "59bf0571af26a42764c847aa",
            "size": 7,
            "name": "Mccullough Baird"
        },
        {
            "_id": "59bf0571949d751ce29eb470",
            "size": 10,
            "name": "Phelps Dillard"
        },
        {
            "_id": "59bf057193c71b8fc13ba326",
            "size": 2,
            "name": "Samantha Marquez"
        },
        {
            "_id": "59bf057144e9ce367200ae86",
            "size": 9,
            "name": "Bond Beck"
        },
        {
            "_id": "59bf057102d7cbd7faa2f81d",
            "size": 1,
            "name": "Milagros Gill"
        },
        {
            "_id": "59bf057135d00aab4f52dbe9",
            "size": 9,
            "name": "Wendy Berg"
        },
        {
            "_id": "59bf0571f75a72f2e2f59dbf",
            "size": 1,
            "name": "Strong Fischer"
        },
        {
            "_id": "59bf05718c830877341ce54f",
            "size": 8,
            "name": "Merrill Goodwin"
        },
        {
            "_id": "59bf05713bc6d78c5439c39b",
            "size": 7,
            "name": "Dixie Cunningham"
        },
        {
            "_id": "59bf0571d80707b7a12b4b55",
            "size": 5,
            "name": "Ortiz Delaney"
        },
        {
            "_id": "59bf05718b9ff923af0dbf37",
            "size": 1,
            "name": "Maria Le"
        },
        {
            "_id": "59bf057157619251df8dbaa8",
            "size": 7,
            "name": "Aimee Boyer"
        },
        {
            "_id": "59bf0571f5be781a74266a91",
            "size": 7,
            "name": "Krista Benson"
        },
        {
            "_id": "59bf0571e19ca19150dc75ab",
            "size": 8,
            "name": "Stevens Black"
        },
        {
            "_id": "59bf0571c35d3877e75e3172",
            "size": 3,
            "name": "Gill Carpenter"
        },
        {
            "_id": "59bf0571198ab8c641a1cec2",
            "size": 7,
            "name": "Ronda Wolfe"
        },
        {
            "_id": "59bf0571e0e3de2964b1d396",
            "size": 2,
            "name": "Corinne Yates"
        },
        {
            "_id": "59bf0571fa114ddd3349e8e0",
            "size": 8,
            "name": "Hammond Mcmahon"
        },
        {
            "_id": "59bf05719c5cc6e05e178356",
            "size": 3,
            "name": "Rodriguez Barnes"
        },
        {
            "_id": "59bf0571be09974ca8a0c194",
            "size": 10,
            "name": "Alana Bird"
        },
        {
            "_id": "59bf0571c4ea5da48eaf9b67",
            "size": 8,
            "name": "Shanna Osborn"
        },
        {
            "_id": "59bf05717bc633c762d2ece4",
            "size": 2,
            "name": "Schultz Simpson"
        },
        {
            "_id": "59bf057178b17092fa9ce8d0",
            "size": 8,
            "name": "Beverly Chandler"
        },
        {
            "_id": "59bf0571837abaa77678f936",
            "size": 9,
            "name": "Noreen Parrish"
        },
        {
            "_id": "59bf057104e360ac8ad385fb",
            "size": 1,
            "name": "Burgess Watts"
        },
        {
            "_id": "59bf05713c45927e30fb5bad",
            "size": 2,
            "name": "Pitts Frost"
        },
        {
            "_id": "59bf0571d147ada6eb67af23",
            "size": 7,
            "name": "Terry Good"
        },
        {
            "_id": "59bf0571f4420ac8abdbc8a7",
            "size": 9,
            "name": "Luisa Molina"
        },
        {
            "_id": "59bf057102b0931313ef2938",
            "size": 1,
            "name": "Fields Morrow"
        },
        {
            "_id": "59bf05715a5595023f0db3c8",
            "size": 8,
            "name": "Odom Deleon"
        },
        {
            "_id": "59bf0571bb3f915ff2a9f35d",
            "size": 5,
            "name": "Kelly Yang"
        },
        {
            "_id": "59bf0571786ce1d5491f0c5a",
            "size": 7,
            "name": "Tate Neal"
        },
        {
            "_id": "59bf0571ef646f52c3b2956d",
            "size": 2,
            "name": "Oneill Cain"
        },
        {
            "_id": "59bf0571915d6062957fb118",
            "size": 1,
            "name": "Winters Velasquez"
        },
        {
            "_id": "59bf0571e873dc1de0ff7f2d",
            "size": 7,
            "name": "Manuela Bender"
        },
        {
            "_id": "59bf0571a0957b6064df4473",
            "size": 1,
            "name": "Hayden Daniel"
        },
        {
            "_id": "59bf0571166cc9a3d17842b6",
            "size": 9,
            "name": "Hampton Dyer"
        },
        {
            "_id": "59bf057193eaefc8dd858c4e",
            "size": 6,
            "name": "Consuelo Olson"
        },
        {
            "_id": "59bf0571c359f0942f139263",
            "size": 1,
            "name": "Sandoval Fulton"
        },
        {
            "_id": "59bf05719e91e695b10d3dd4",
            "size": 3,
            "name": "Harrington Mcintosh"
        },
        {
            "_id": "59bf057197262ba4ccb769d4",
            "size": 9,
            "name": "Ila Stevenson"
        },
        {
            "_id": "59bf057173466082c4a824c8",
            "size": 3,
            "name": "Vivian Rush"
        },
        {
            "_id": "59bf0571d191439178e5f07a",
            "size": 7,
            "name": "Bender Ramos"
        },
        {
            "_id": "59bf057176a99a75f01e88d5",
            "size": 8,
            "name": "Cunningham Ford"
        },
        {
            "_id": "59bf05717a1f96d34d72e44b",
            "size": 7,
            "name": "Fuentes Noel"
        },
        {
            "_id": "59bf05713170603c5d0a828f",
            "size": 10,
            "name": "Sykes Malone"
        },
        {
            "_id": "59bf05713ed4bb932658f015",
            "size": 9,
            "name": "Erin Ayers"
        },
        {
            "_id": "59bf0571c3c4b46ef25cc45e",
            "size": 5,
            "name": "Hopkins Olsen"
        },
        {
            "_id": "59bf057142fd3a96769b4328",
            "size": 10,
            "name": "Jeri Pitts"
        },
        {
            "_id": "59bf0571d35c25c6d270e9f8",
            "size": 2,
            "name": "Adams Day"
        },
        {
            "_id": "59bf0571d8c633348aeb57db",
            "size": 2,
            "name": "Holloway Cleveland"
        },
        {
            "_id": "59bf0571f7e7e4f736dc08a1",
            "size": 10,
            "name": "Peck Tucker"
        },
        {
            "_id": "59bf05710847e8ea8ccef488",
            "size": 2,
            "name": "Dalton Collins"
        },
        {
            "_id": "59bf0571dd102ef895acaf2d",
            "size": 3,
            "name": "Gale Lancaster"
        },
        {
            "_id": "59bf05713b70ebca5caa2e13",
            "size": 6,
            "name": "Joseph Vazquez"
        },
        {
            "_id": "59bf05719bc3ff46f29d3693",
            "size": 4,
            "name": "Abbott Rogers"
        },
        {
            "_id": "59bf05719eb1b9ca2fd081cf",
            "size": 7,
            "name": "Vera Kline"
        },
        {
            "_id": "59bf0571b0e1f65e3a083c30",
            "size": 6,
            "name": "Burks Aguirre"
        },
        {
            "_id": "59bf05713f78699b8c07f3f9",
            "size": 7,
            "name": "Marva Castillo"
        },
        {
            "_id": "59bf0571ff954b13a6d5f21d",
            "size": 7,
            "name": "Acosta Carlson"
        },
        {
            "_id": "59bf0571f4f5d6679eedc21f",
            "size": 6,
            "name": "Florence Nash"
        },
        {
            "_id": "59bf05714bdb6982d2395e5f",
            "size": 10,
            "name": "Guerrero Chang"
        },
        {
            "_id": "59bf0571e2e0acab1c9d2ea5",
            "size": 9,
            "name": "Ware Kirby"
        },
        {
            "_id": "59bf0571c1fab833038848a7",
            "size": 8,
            "name": "Dorothy Barron"
        },
        {
            "_id": "59bf0571fe3607ed496d53c0",
            "size": 9,
            "name": "Robbins Dudley"
        },
        {
            "_id": "59bf0571302bf7e5944de36f",
            "size": 10,
            "name": "Rosemary Nelson hodahusoidhaäpsidhpih pia spodhaspohdpaoshd pas dpoasj döi asöoidasidoaisüdiasopd poasidaskädkasoödj asoj do ahsoidiashdi aishdlkasdökasldk alskdklashdlk ashdl ashldkhasldkhaslk dhlaskdhlaskhdlka slahdslkahdl sahdlkashdlk asdlahsdlkhas l. oasbdkasbdoibasid iashdpi asöd aspoapsjdoöajsöd asdjasökdjökas aösjdöasjd alskjdakösjdöasjdöasj askjdklasjd alskjdalk sdlkasljdlkasjdlkasjld sakdjlaksjdlkas aksjdlkasjd askljdlaksjd askldjalksjd ."
        },
        {
            "_id": "59bf05710487508722cc8c41",
            "size": 9,
            "name": "Flores Nunez"
        },
        {
            "_id": "59bf0571814b610799ef0e4e",
            "size": 8,
            "name": "Opal Blankenship"
        },
        {
            "_id": "59bf057146b166b1110af7d0",
            "size": 4,
            "name": "Lorrie Briggs"
        },
        {
            "_id": "59bf05713b044ed59bfded0d",
            "size": 3,
            "name": "Bettie Chapman"
        },
        {
            "_id": "59bf05712ce14e3a6e7e44a0",
            "size": 2,
            "name": "Sue Barry"
        },
        {
            "_id": "59bf0571d75f11008233ad5c",
            "size": 1,
            "name": "Wilkinson Nguyen"
        },
        {
            "_id": "59bf05715276806ce72dd956",
            "size": 4,
            "name": "Love Carrillo"
        },
        {
            "_id": "59bf05719a77d7c04e3c8b7d",
            "size": 4,
            "name": "Rae Austin"
        },
        {
            "_id": "59bf0571690cd82939a245f6",
            "size": 8,
            "name": "Lou Whitehead"
        },
        {
            "_id": "59bf057163efae8429ae2d67",
            "size": 2,
            "name": "Rose Martinez"
        },
        {
            "_id": "59bf0571a0afc8cd06260cad",
            "size": 7,
            "name": "Guerra Oneal"
        },
        {
            "_id": "59bf05716c7d2f595ac56e58",
            "size": 5,
            "name": "Duke Knight"
        },
        {
            "_id": "59bf057170b1c9de8a0a0eea",
            "size": 9,
            "name": "Mays Guerra"
        },
        {
            "_id": "59bf0571b78655a9fe617e59",
            "size": 10,
            "name": "Terra Reyes"
        },
        {
            "_id": "59bf0571ce866fbf7cf46d53",
            "size": 5,
            "name": "Stacey Salas"
        },
        {
            "_id": "59bf0571a20b6a191bc6929f",
            "size": 8,
            "name": "Nelda Bryant"
        },
        {
            "_id": "59bf057118ad024dc65647d3",
            "size": 8,
            "name": "Dale Bradley"
        },
        {
            "_id": "59bf0571f438ae5dd77f3297",
            "size": 5,
            "name": "Tameka Stuart"
        },
        {
            "_id": "59bf0571f56f37fd70873b29",
            "size": 4,
            "name": "Maryann Fleming"
        },
        {
            "_id": "59bf0571a67269293b590ee8",
            "size": 1,
            "name": "Suzanne Cotton"
        },
        {
            "_id": "59bf057111b2bffcc33c6224",
            "size": 5,
            "name": "Leanne Mcgowan"
        },
        {
            "_id": "59bf057193879f8c606e7f7a",
            "size": 8,
            "name": "Vaughn Powers"
        },
        {
            "_id": "59bf05719dd1750ba082a919",
            "size": 7,
            "name": "Marie Zamora"
        },
        {
            "_id": "59bf05719f6b84975998ef32",
            "size": 1,
            "name": "Ina Osborne"
        },
        {
            "_id": "59bf05717efd30fac454584c",
            "size": 8,
            "name": "Karla Lara"
        },
        {
            "_id": "59bf05717723daa5b84be287",
            "size": 3,
            "name": "Weber Park"
        },
        {
            "_id": "59bf0571f6dd9dd23d8ed382",
            "size": 6,
            "name": "Dixon Norris"
        },
        {
            "_id": "59bf0571dfe6d3af1bd3c449",
            "size": 10,
            "name": "Gilliam Stafford"
        },
        {
            "_id": "59bf05714e4657e00d869151",
            "size": 2,
            "name": "Gayle Vinson"
        },
        {
            "_id": "59bf0571ae6bf0224b5156fc",
            "size": 9,
            "name": "Jenifer Fitzpatrick"
        },
        {
            "_id": "59bf0571883903838dc5b16e",
            "size": 3,
            "name": "Josefina Orr"
        },
        {
            "_id": "59bf057139f8a4dc7c008fd3",
            "size": 7,
            "name": "Cantrell Shaw"
        },
        {
            "_id": "59bf05715d7e3ea9df0d8920",
            "size": 2,
            "name": "Maura Newman"
        },
        {
            "_id": "59bf05719c8a79ef506abbf3",
            "size": 1,
            "name": "Alyssa Howard"
        },
        {
            "_id": "59bf0571a60ae3b374f0f93c",
            "size": 9,
            "name": "West Bolton"
        },
        {
            "_id": "59bf05712b72bead86b7ccc2",
            "size": 9,
            "name": "Daugherty Odom"
        },
        {
            "_id": "59bf0571c8fd969af50b440d",
            "size": 5,
            "name": "Olson Ellison"
        },
        {
            "_id": "59bf05710922b74cb20efcf2",
            "size": 5,
            "name": "Wilcox French"
        },
        {
            "_id": "59bf0571791dfc4a9d2c27f5",
            "size": 7,
            "name": "Day Sampson"
        },
        {
            "_id": "59bf05714e253914af27e36c",
            "size": 5,
            "name": "Good Pollard"
        },
        {
            "_id": "59bf0571a2e10b5b94cb5483",
            "size": 5,
            "name": "Kenya Garcia"
        },
        {
            "_id": "59bf0571d6bcb19d7071a254",
            "size": 7,
            "name": "Doris Avery"
        },
        {
            "_id": "59bf057122f472b17e663456",
            "size": 1,
            "name": "Reyes Sellers"
        },
        {
            "_id": "59bf05718d84dad97a9d3e22",
            "size": 6,
            "name": "Paige Bruce"
        },
        {
            "_id": "59bf0571cb8270ab7de0b3db",
            "size": 4,
            "name": "Minerva Roman"
        },
        {
            "_id": "59bf057182f8ae9129a88d8c",
            "size": 6,
            "name": "Alexis Perry"
        },
        {
            "_id": "59bf05714af9b9879f9ee734",
            "size": 7,
            "name": "Mcmillan Hyde"
        },
        {
            "_id": "59bf0571eb9c9c34b64bc2f6",
            "size": 9,
            "name": "Colette Hale"
        },
        {
            "_id": "59bf0571a2d2552040a8e85c",
            "size": 5,
            "name": "Christina Hudson"
        },
        {
            "_id": "59bf0571731aaaad8419237f",
            "size": 10,
            "name": "Florine Jacobson"
        },
        {
            "_id": "59bf0571b638958d27437959",
            "size": 8,
            "name": "Estes Crosby"
        },
        {
            "_id": "59bf0571b528a1c0b3ef3929",
            "size": 9,
            "name": "Lindsey Salazar"
        },
        {
            "_id": "59bf0571e6ba933c4d4782fc",
            "size": 6,
            "name": "Karyn Cook"
        },
        {
            "_id": "59bf0571ad95005a60b089cc",
            "size": 3,
            "name": "Casey Hardy"
        },
        {
            "_id": "59bf05711de1f0f75eb0955a",
            "size": 9,
            "name": "Aisha Rodgers"
        },
        {
            "_id": "59bf0571a25aa7efb1abe107",
            "size": 6,
            "name": "King Santiago"
        },
        {
            "_id": "59bf0571fe13d12874b9ab93",
            "size": 10,
            "name": "Katelyn Elliott"
        },
        {
            "_id": "59bf057146193423d6b940ae",
            "size": 8,
            "name": "Angie Kane"
        },
        {
            "_id": "59bf0571136c0801e836c363",
            "size": 8,
            "name": "Diaz Francis"
        },
        {
            "_id": "59bf05710c7b6946f19c2cb6",
            "size": 5,
            "name": "Holder Rojas"
        },
        {
            "_id": "59bf057117d86575619d94d9",
            "size": 1,
            "name": "Estela Hopper"
        },
        {
            "_id": "59bf0571cbd905809f61b6dc",
            "size": 5,
            "name": "Merritt Long"
        },
        {
            "_id": "59bf0571c8312df81d50fcd9",
            "size": 4,
            "name": "Hardin Rios"
        },
        {
            "_id": "59bf057116deaf28dafc6d7c",
            "size": 6,
            "name": "House Chen"
        },
        {
            "_id": "59bf0571482a0dc884b68735",
            "size": 8,
            "name": "Baldwin Hinton"
        },
        {
            "_id": "59bf057107274f14c9f8c9b3",
            "size": 8,
            "name": "Lillie Wallace"
        },
        {
            "_id": "59bf057194e11206909557e8",
            "size": 3,
            "name": "Dale Farmer"
        },
        {
            "_id": "59bf05718ee8a371c2ed57cc",
            "size": 1,
            "name": "Cathy Ferrell"
        },
        {
            "_id": "59bf0571be910e74c40e3be3",
            "size": 10,
            "name": "Poole Horn"
        },
        {
            "_id": "59bf057154e71c56cca925ea",
            "size": 8,
            "name": "Patrica Stein"
        },
        {
            "_id": "59bf05718614404ddf246257",
            "size": 1,
            "name": "Mercer Dodson"
        },
        {
            "_id": "59bf0571977abbb3c93b4125",
            "size": 5,
            "name": "Lott Spence"
        },
        {
            "_id": "59bf057119da08a5343cd4cb",
            "size": 6,
            "name": "Lancaster Oneil"
        },
        {
            "_id": "59bf057170bbf9524c517cdc",
            "size": 8,
            "name": "Melva Schwartz"
        },
        {
            "_id": "59bf05717b3a6c61354d5b10",
            "size": 9,
            "name": "Angelita Mccray"
        },
        {
            "_id": "59bf0571aea3f0ecf2087212",
            "size": 1,
            "name": "Chambers Luna"
        },
        {
            "_id": "59bf0571516bd29d07b834d2",
            "size": 8,
            "name": "Jo Hubbard"
        },
        {
            "_id": "59bf05717e308d86931db875",
            "size": 6,
            "name": "Wade Lindsay"
        },
        {
            "_id": "59bf05716b7d0768cd4619da",
            "size": 2,
            "name": "Bethany Church"
        },
        {
            "_id": "59bf05711e7105972d30ae7f",
            "size": 8,
            "name": "Bradshaw Peters"
        },
        {
            "_id": "59bf0571ad61f998f8fa329b",
            "size": 4,
            "name": "Jones Barker"
        },
        {
            "_id": "59bf0571478217eb8f01213e",
            "size": 4,
            "name": "Amanda Sharp"
        },
        {
            "_id": "59bf0571a3cf5777e3aa7ffa",
            "size": 8,
            "name": "Higgins Hurst"
        },
        {
            "_id": "59bf05715b6af9f1fb775476",
            "size": 10,
            "name": "Geraldine Wynn"
        },
        {
            "_id": "59bf057180d66d4847245191",
            "size": 8,
            "name": "Cannon Gonzalez"
        },
        {
            "_id": "59bf0571a8d24db6df641c6f",
            "size": 9,
            "name": "Levy Maynard"
        },
        {
            "_id": "59bf05718d87c4dd8c6f89a6",
            "size": 9,
            "name": "Parsons Holmes"
        },
        {
            "_id": "59bf0571228d33b6ba6d93e0",
            "size": 2,
            "name": "Randi Blevins"
        },
        {
            "_id": "59bf0571609a258bebd79ec0",
            "size": 5,
            "name": "Bridgette Guthrie"
        },
        {
            "_id": "59bf057127f15e6471a9c539",
            "size": 1,
            "name": "Cynthia Talley"
        },
        {
            "_id": "59bf0571824cc36523222e3c",
            "size": 1,
            "name": "Chan Mack"
        },
        {
            "_id": "59bf057135e704b020f8ed9f",
            "size": 2,
            "name": "Bauer Griffin"
        },
        {
            "_id": "59bf05716b2c8dc558fc6e9a",
            "size": 2,
            "name": "Stephens Scott"
        },
        {
            "_id": "59bf0571e02bb4f82cb865a6",
            "size": 8,
            "name": "Hodges Taylor"
        },
        {
            "_id": "59bf05718932acc2063bed3e",
            "size": 7,
            "name": "Talley Witt"
        },
        {
            "_id": "59bf05718174a485daedc9dc",
            "size": 2,
            "name": "Roberta Dejesus"
        },
        {
            "_id": "59bf057118447590c53aea3d",
            "size": 7,
            "name": "Vega Justice"
        },
        {
            "_id": "59bf0571e4b9055d34e727bd",
            "size": 2,
            "name": "Burke Herrera"
        },
        {
            "_id": "59bf05713d3a0988b5ed5911",
            "size": 9,
            "name": "Jolene Cummings"
        },
        {
            "_id": "59bf0571431e1df402af6894",
            "size": 4,
            "name": "Garza Nieves"
        }
    ];

    const initializeCharts = function() {
        drawSunburst(chapter, bubbleData);
    };

    $.get( "ajax/test.html", function( data ) {
        $( ".result" ).html( data );
        alert( "Load was performed." );
    });

    $(window).resize(function() {
        initializeCharts();
    });

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        initializeCharts();
    });
});
