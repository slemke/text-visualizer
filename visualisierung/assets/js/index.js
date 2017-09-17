"use strict"

$(document).ready(function() {
    var instance = Split(['#visualization', '#text'], {
        sizes: [60, 40],
        onDrag: function() {

            initializeCharts();
        }
    });

    var textClosed = false;

    $('#collapse-text-button').click(function(event) {
        event.preventDefault();

        if(textClosed) {
            instance.setSizes([60, 40]);
            textClosed = false;
            $(this).html('&raquo;');
        } else {
            instance.collapse(1);
            textClosed = true;
            $(this).html('&laquo;');
        }
    });

    let chapter = {
       "id": 0,
       "name": "TOPICS",
       "size": 0,
       "children": [{
           "id": 1,
           "name": "Topic A",
           "size": 1.124,
           "children": [{
               "id": 2,
               "name": "Sub A1",
               "size": 1.125,
               "children": [{
                   "id": 3,
                   "name": "Sub A1.1",
                   "size": 2.24
               }, {
                   "id": 4,
                   "name": "Sub A1.2",
                   "size": 2.25,
                   "children": [{
                       "id": 25,
                       "name": "Sub A1.2.1",
                       "size": 3.374
                   }, {
                       "id": 26,
                       "name": "Sub A1.2.2",
                       "size": 3.375
                   }]
               }, {
                   "id": 5,
                   "name": "Sub A1.3",
                   "size": 4.49
               }, {
                   "id": 16,
                   "name": "Sub A1.4",
                   "size": 4.5
               }, {
                   "id": 17,
                   "name": "Sub A1.5",
                   "size": 5.624
               }]
           }, {
               "id": 6,
               "name": "Sub A2",
               "size": 5.625
           }, {
               "id": 18,
               "name": "Sub A1.2",
               "size": 5,
               "children": [{
                   "id": 19,
                   "name": "Sub A1.2.1",
                   "size": 0.4
               }, {
                   "id": 20,
                   "name": "Sub A1.2.2",
                   "size": 2.9
               }]
           }, {
               "id": 21,
               "name": "Sub A1.3",
               "size": 0.1
           }]
       }, {
           "id": 7,
           "name": "Topic B",
           "size": 0,
           "children": [{
               "id": 8,
               "name": "Sub B1",
               "size": 3
           }, {
               "id": 9,
               "name": "Sub B2",
               "size": 3
           }, {
               "id": 10,
               "name": "Sub B3",
               "size": 3,
               "children": [{
                   "id": 14,
                   "name": "Sub A1.1.1",
                   "size": 1
               }, {
                   "id": 15,
                   "name": "Sub A1.1.2",
                   "size": 1.5
               }]
           }]
       }, {
           "id": 11,
           "name": "Topic C",
           "size": 0,
           "children": [{
               "id": 12,
               "name": "Sub A1",
               "size": 4
           }, {
               "id": 13,
               "name": "Sub A2",
               "size": 4,
               "children": [{
                   "id": 23,
                   "name": "Sub A2.1",
                   "size": 0.5
               }, {
                   "id": 24,
                   "name": "Sub A2.2",
                   "size": 0.9,
                   "children": [{
                       "id": 27,
                       "name": "Sub A2.2.1",
                       "size": 0.5
                   }, {
                       "id": 28,
                       "name": "Sub A2.2.2",
                       "size": 0.9
                   }]
               }]
           }]
       }, {
           "id": 22,
           "name": "Topic D",
           "size": 2.6
       }]
    };

    const bubbleData = [
        {
            "_id": "59bed687f284bca9b666e8af",
            "amount": 12,
            "name": "Carissa Beach"
        },
        {
            "_id": "59bed6870e08fe3915983464",
            "amount": 65,
            "name": "Dawson Shepard"
        },
        {
            "_id": "59bed687de8d297dfda9315c",
            "amount": 61,
            "name": "Noel Downs"
        },
        {
            "_id": "59bed687fa503918c68b8123",
            "amount": 3,
            "name": "Reeves Harrington"
        },
        {
            "_id": "59bed6870357752f54087bd1",
            "amount": 96,
            "name": "Georgia Irwin"
        },
        {
            "_id": "59bed6873484484ed54adc18",
            "amount": 88,
            "name": "Saunders Cummings"
        },
        {
            "_id": "59bed687864e9c644cd18c44",
            "amount": 39,
            "name": "Katharine Sandoval"
        },
        {
            "_id": "59bed687b7b23122dcc5e83d",
            "amount": 59,
            "name": "Jeanie Nguyen"
        },
        {
            "_id": "59bed687af1b014d78cd5c7b",
            "amount": 24,
            "name": "Ramona Daniel"
        },
        {
            "_id": "59bed687763a638ad8ada2fb",
            "amount": 89,
            "name": "Stuart Sanford"
        },
        {
            "_id": "59bed6875eafb42717a19942",
            "amount": 58,
            "name": "Callahan Salas"
        },
        {
            "_id": "59bed6877649d324fe17363f",
            "amount": 90,
            "name": "Donovan Montgomery"
        },
        {
            "_id": "59bed68701e9f125ebbf5fdf",
            "amount": 20,
            "name": "Isabel Delacruz"
        },
        {
            "_id": "59bed6874c2104496fe0b6b9",
            "amount": 25,
            "name": "Zelma Levy"
        },
        {
            "_id": "59bed687c7a2305d2fad4141",
            "amount": 75,
            "name": "Stevenson Christian"
        },
        {
            "_id": "59bed687161f8638689671eb",
            "amount": 82,
            "name": "Duran Crosby"
        },
        {
            "_id": "59bed6878e0fee263c1ca604",
            "amount": 31,
            "name": "Frazier Wagner"
        },
        {
            "_id": "59bed68799879ec6e660d3ff",
            "amount": 91,
            "name": "Christina Farmer"
        },
        {
            "_id": "59bed6876897c533ed9c730d",
            "amount": 84,
            "name": "Luz Wilkins"
        },
        {
            "_id": "59bed6871f6054ee70b7f802",
            "amount": 37,
            "name": "Lizzie Moon"
        },
        {
            "_id": "59bed687ce6bead36b94e25c",
            "amount": 31,
            "name": "Bell Guthrie"
        },
        {
            "_id": "59bed6870a050c46d160a91b",
            "amount": 25,
            "name": "Campos Cooke"
        },
        {
            "_id": "59bed6871ee5e33a3d85bcda",
            "amount": 73,
            "name": "Howe Oneal"
        },
        {
            "_id": "59bed687287c011cb3a8c66a",
            "amount": 25,
            "name": "Angelique Jacobs"
        },
        {
            "_id": "59bed687fd23289923c34f5c",
            "amount": 8,
            "name": "Etta Russell"
        },
        {
            "_id": "59bed687dac8b534744cb35f",
            "amount": 61,
            "name": "Boone Bryan"
        },
        {
            "_id": "59bed687df7fa2f84d9b2eb7",
            "amount": 90,
            "name": "Mercedes Rios"
        },
        {
            "_id": "59bed68792ae8f0fe779494a",
            "amount": 62,
            "name": "Barton Mcgowan"
        },
        {
            "_id": "59bed6873d7e55ff6afa6231",
            "amount": 60,
            "name": "Maura Tucker"
        },
        {
            "_id": "59bed6876e3ccd010229e62b",
            "amount": 18,
            "name": "Spencer Boyer"
        },
        {
            "_id": "59bed687c7eff1452639e8b5",
            "amount": 42,
            "name": "Frost Clarke"
        },
        {
            "_id": "59bed6871a987daf4daa1319",
            "amount": 45,
            "name": "Pansy Fuentes"
        },
        {
            "_id": "59bed68796bd7c90d5abc715",
            "amount": 64,
            "name": "Millie Sims"
        },
        {
            "_id": "59bed687fcb758522383bf0f",
            "amount": 19,
            "name": "Vanessa Miller"
        },
        {
            "_id": "59bed687ed14d16b4f053f80",
            "amount": 48,
            "name": "Lorraine Lowe"
        },
        {
            "_id": "59bed68796b8563be124d893",
            "amount": 24,
            "name": "Florence Rosales"
        },
        {
            "_id": "59bed68755b2e5e69d7abc37",
            "amount": 90,
            "name": "Lucas Chandler"
        },
        {
            "_id": "59bed687d3f2cb5cac1b67ab",
            "amount": 50,
            "name": "Duffy Benjamin"
        },
        {
            "_id": "59bed6876efea08e38eab5ce",
            "amount": 60,
            "name": "Fernandez Hayes"
        },
        {
            "_id": "59bed6879bb1a555a1a4318d",
            "amount": 54,
            "name": "Jessica Buck"
        },
        {
            "_id": "59bed68720fa44b0f41bbb8f",
            "amount": 26,
            "name": "Kelley Mayo"
        },
        {
            "_id": "59bed687955e5556388a39ca",
            "amount": 49,
            "name": "Klein Burke"
        },
        {
            "_id": "59bed687d3d6d247daa62ad4",
            "amount": 43,
            "name": "Norris Perez"
        },
        {
            "_id": "59bed6876e3894e362e26184",
            "amount": 58,
            "name": "Kristen English"
        },
        {
            "_id": "59bed6876b38b47af063575d",
            "amount": 98,
            "name": "Corina Talley"
        },
        {
            "_id": "59bed687b97e49108f683219",
            "amount": 33,
            "name": "Deidre Allen"
        },
        {
            "_id": "59bed687a94b867a4612ef9e",
            "amount": 79,
            "name": "Candy Thornton"
        },
        {
            "_id": "59bed6873ffe855516e2c6dc",
            "amount": 35,
            "name": "Navarro Harvey"
        },
        {
            "_id": "59bed687f0f100deed734c4b",
            "amount": 73,
            "name": "Helena Combs"
        },
        {
            "_id": "59bed6871b7ed42965d709ed",
            "amount": 55,
            "name": "Berg Juarez"
        },
        {
            "_id": "59bed687c5fe284a21899b09",
            "amount": 41,
            "name": "Howard Holloway"
        },
        {
            "_id": "59bed6874dd29998dcfac3e8",
            "amount": 11,
            "name": "Freeman Hutchinson"
        },
        {
            "_id": "59bed68735c180d9b161c585",
            "amount": 23,
            "name": "Valenzuela Ramsey"
        },
        {
            "_id": "59bed6876bd61382f8cae5e6",
            "amount": 64,
            "name": "Lancaster Joyce"
        },
        {
            "_id": "59bed687887877197b5732be",
            "amount": 5,
            "name": "Fry Caldwell"
        },
        {
            "_id": "59bed687560f97ecc9caa658",
            "amount": 29,
            "name": "May Boone"
        },
        {
            "_id": "59bed687f18bc702623242bd",
            "amount": 73,
            "name": "Cleveland Hooper"
        },
        {
            "_id": "59bed687cab0793e5a401e3a",
            "amount": 62,
            "name": "Sophia Navarro"
        },
        {
            "_id": "59bed687a93e96a00d4e3199",
            "amount": 15,
            "name": "Audra Mason"
        },
        {
            "_id": "59bed6879a7febc4f83e24f2",
            "amount": 17,
            "name": "Evans Knox"
        },
        {
            "_id": "59bed6876d4f960fe3c10503",
            "amount": 61,
            "name": "Alvarez Goff"
        },
        {
            "_id": "59bed687acf0a35105aba802",
            "amount": 91,
            "name": "Lorna Day"
        },
        {
            "_id": "59bed687024fa0dc78d74792",
            "amount": 6,
            "name": "Jacklyn Maldonado"
        },
        {
            "_id": "59bed68737aa3424dad74340",
            "amount": 20,
            "name": "Chaney Stephenson"
        },
        {
            "_id": "59bed687d2229c31d40bef26",
            "amount": 40,
            "name": "Kelly Barnes"
        },
        {
            "_id": "59bed6871117418b44693769",
            "amount": 55,
            "name": "Sherrie Coffey"
        },
        {
            "_id": "59bed687d9c065e709b0f3dd",
            "amount": 9,
            "name": "Holder Berger"
        },
        {
            "_id": "59bed6878fd630def3f0a7f7",
            "amount": 90,
            "name": "Shelly Kirk"
        },
        {
            "_id": "59bed68793e14dfc8b25d195",
            "amount": 99,
            "name": "Elisabeth Copeland"
        },
        {
            "_id": "59bed6874cc6103caee54c40",
            "amount": 43,
            "name": "Sawyer Solomon"
        },
        {
            "_id": "59bed687a8534aedf95bf1b0",
            "amount": 59,
            "name": "Judith Reyes"
        },
        {
            "_id": "59bed6878ee3558abc4c118b",
            "amount": 85,
            "name": "Patricia Christensen"
        },
        {
            "_id": "59bed687c7fe4d518840f137",
            "amount": 44,
            "name": "Patsy Singleton"
        },
        {
            "_id": "59bed687c6206e94683d7f64",
            "amount": 21,
            "name": "Roxie Sanchez"
        },
        {
            "_id": "59bed687d380cc30a36ba272",
            "amount": 44,
            "name": "Tanya Melendez"
        },
        {
            "_id": "59bed6872efdbc49b6ae7133",
            "amount": 42,
            "name": "Leslie Richmond"
        },
        {
            "_id": "59bed687d30943f0a71fcba0",
            "amount": 19,
            "name": "Althea Berry"
        },
        {
            "_id": "59bed68706e7978e664e3ef5",
            "amount": 8,
            "name": "Marcella Richards"
        },
        {
            "_id": "59bed687a52e05a595908703",
            "amount": 6,
            "name": "Maritza Cervantes"
        },
        {
            "_id": "59bed687fe8e79e89006228e",
            "amount": 29,
            "name": "Potts Vaughan"
        },
        {
            "_id": "59bed687d109e42b662ae0e7",
            "amount": 57,
            "name": "Mullins Hunt"
        },
        {
            "_id": "59bed68700b0dd2ecbc347f2",
            "amount": 87,
            "name": "Walker Briggs"
        },
        {
            "_id": "59bed6870230a790a427795b",
            "amount": 9,
            "name": "Mildred Mckinney"
        },
        {
            "_id": "59bed68708a480f6c5ac5ca3",
            "amount": 7,
            "name": "Harmon Preston"
        },
        {
            "_id": "59bed68706f4414bf8dcc58c",
            "amount": 65,
            "name": "Steele Dejesus"
        },
        {
            "_id": "59bed6877fb96239119adad0",
            "amount": 59,
            "name": "Priscilla Slater"
        },
        {
            "_id": "59bed68721afeb5ea36ec31c",
            "amount": 14,
            "name": "Hale Herman"
        },
        {
            "_id": "59bed687a5ef2d94b7620fcd",
            "amount": 75,
            "name": "Gomez Hyde"
        },
        {
            "_id": "59bed687778d5dd8742c98ec",
            "amount": 35,
            "name": "Russo Mccray"
        },
        {
            "_id": "59bed6874c0508c5a3ce7a67",
            "amount": 9,
            "name": "Briggs George"
        },
        {
            "_id": "59bed687326bfea314aec7c7",
            "amount": 38,
            "name": "Joanne Castaneda"
        },
        {
            "_id": "59bed687390c0b16e4f9f096",
            "amount": 70,
            "name": "Hughes Suarez"
        },
        {
            "_id": "59bed687f25ddb1fc20c158f",
            "amount": 72,
            "name": "Berry Mueller"
        },
        {
            "_id": "59bed687b183481587d7cfb6",
            "amount": 31,
            "name": "Calhoun Alexander"
        },
        {
            "_id": "59bed687798f3b97565226d8",
            "amount": 98,
            "name": "Cruz Ramirez"
        },
        {
            "_id": "59bed687c308c43050d5eb28",
            "amount": 27,
            "name": "Robin White"
        },
        {
            "_id": "59bed687c84131e1785d6987",
            "amount": 44,
            "name": "Cheryl Frazier"
        },
        {
            "_id": "59bed6874509b3689b57c533",
            "amount": 88,
            "name": "Wolfe Wiggins"
        },
        {
            "_id": "59bed687d6244c130e9a463e",
            "amount": 61,
            "name": "Cecelia May"
        },
        {
            "_id": "59bed687405b3a786d726d58",
            "amount": 27,
            "name": "Paige Stokes"
        },
        {
            "_id": "59bed687590847d6394c9dc0",
            "amount": 23,
            "name": "Sue Sweeney"
        },
        {
            "_id": "59bed687efe994d617987e45",
            "amount": 3,
            "name": "Shepard Evans"
        },
        {
            "_id": "59bed68759aa2bb5f74ce7fa",
            "amount": 88,
            "name": "Josefina Dorsey"
        },
        {
            "_id": "59bed6870c030274a1e7e3f5",
            "amount": 93,
            "name": "Peck Shaffer"
        },
        {
            "_id": "59bed687e77ec91888632df7",
            "amount": 58,
            "name": "Horton Larson"
        },
        {
            "_id": "59bed6871525413d119d181d",
            "amount": 17,
            "name": "Albert Rodgers"
        },
        {
            "_id": "59bed687b2d001151dd2ee4e",
            "amount": 68,
            "name": "Rosetta Martinez"
        },
        {
            "_id": "59bed687a99f3e44c288596e",
            "amount": 51,
            "name": "Glenda Ingram"
        },
        {
            "_id": "59bed687defb9267d97a3ff1",
            "amount": 16,
            "name": "York Parrish"
        },
        {
            "_id": "59bed687be06771c231fdaf1",
            "amount": 74,
            "name": "Odessa Hays"
        },
        {
            "_id": "59bed687f2814667f48e2a9a",
            "amount": 14,
            "name": "Terrell Carey"
        },
        {
            "_id": "59bed68792764f397c36df6d",
            "amount": 46,
            "name": "Ellis Townsend"
        },
        {
            "_id": "59bed687c49cf7b26a0b2e76",
            "amount": 81,
            "name": "Haley Duran"
        },
        {
            "_id": "59bed687ab650fc50eaa8115",
            "amount": 100,
            "name": "Alta Odom"
        },
        {
            "_id": "59bed687f32018ff9f4fb0d9",
            "amount": 4,
            "name": "Carlene Hanson"
        },
        {
            "_id": "59bed687fa4d13172e5fa443",
            "amount": 40,
            "name": "Santos Murphy"
        },
        {
            "_id": "59bed687e0ec09ef0c47afbb",
            "amount": 5,
            "name": "Katina Walsh"
        },
        {
            "_id": "59bed6878f311c7c720d7140",
            "amount": 2,
            "name": "Brooks Foley"
        },
        {
            "_id": "59bed687e9342f8b1abef313",
            "amount": 65,
            "name": "Riley Carver"
        },
        {
            "_id": "59bed687376a3a813bad103f",
            "amount": 67,
            "name": "Latonya Moody"
        },
        {
            "_id": "59bed687bc31acbac4ee7c34",
            "amount": 7,
            "name": "Cote Hubbard"
        },
        {
            "_id": "59bed687ffb05593d898899b",
            "amount": 49,
            "name": "Allyson Mcmahon"
        },
        {
            "_id": "59bed6878557c1485b3aa0d7",
            "amount": 80,
            "name": "Pacheco Carney"
        },
        {
            "_id": "59bed6875bdc26d859028b5c",
            "amount": 96,
            "name": "Iris Figueroa"
        },
        {
            "_id": "59bed6874a44b17f534409b0",
            "amount": 63,
            "name": "Lynnette Berg"
        },
        {
            "_id": "59bed687daf03902cf96de1c",
            "amount": 5,
            "name": "Tia Jefferson"
        },
        {
            "_id": "59bed687107ab75573d3958b",
            "amount": 27,
            "name": "Stacy Newton"
        },
        {
            "_id": "59bed687d4fe88626398433e",
            "amount": 98,
            "name": "Mcdonald Anthony"
        },
        {
            "_id": "59bed68736be8569080cac65",
            "amount": 17,
            "name": "Madelyn Salazar"
        },
        {
            "_id": "59bed687db68e94e0999c55a",
            "amount": 11,
            "name": "Flossie Kerr"
        },
        {
            "_id": "59bed687916798d878e2a072",
            "amount": 86,
            "name": "Lacy Harding"
        },
        {
            "_id": "59bed687e2deb2f374189ed3",
            "amount": 91,
            "name": "Tonya Gilmore"
        },
        {
            "_id": "59bed68754313c64c8cfc068",
            "amount": 88,
            "name": "Glenna Lamb"
        },
        {
            "_id": "59bed6876b03c3f6e77e7df0",
            "amount": 15,
            "name": "Lindsey Woodward"
        },
        {
            "_id": "59bed68767b0211a83e8bd82",
            "amount": 33,
            "name": "Samantha Cleveland"
        },
        {
            "_id": "59bed687a2cd74bbd170ae0a",
            "amount": 9,
            "name": "Adela Acosta"
        },
        {
            "_id": "59bed687467a4acb8fb7dc20",
            "amount": 24,
            "name": "Hopkins Galloway"
        },
        {
            "_id": "59bed6874bb043ce5931f177",
            "amount": 90,
            "name": "Le Erickson"
        },
        {
            "_id": "59bed687fc005549b666816f",
            "amount": 91,
            "name": "Webster Merrill"
        },
        {
            "_id": "59bed687d9ca20ecbee985eb",
            "amount": 81,
            "name": "Richards Carroll"
        },
        {
            "_id": "59bed687256cfbee1ffd385a",
            "amount": 52,
            "name": "Mayo Burks"
        },
        {
            "_id": "59bed687d76f8dc5927c4813",
            "amount": 28,
            "name": "Merle Wilson"
        },
        {
            "_id": "59bed687223e6680f2495b11",
            "amount": 50,
            "name": "Dunlap Garner"
        },
        {
            "_id": "59bed6878344567bdde12244",
            "amount": 29,
            "name": "Ortiz Velasquez"
        },
        {
            "_id": "59bed687995e234d7b6268f6",
            "amount": 50,
            "name": "Coleen Case"
        },
        {
            "_id": "59bed6879c43d50f4d92a583",
            "amount": 25,
            "name": "Ferguson Newman"
        },
        {
            "_id": "59bed68733a6257fadaaf1fd",
            "amount": 40,
            "name": "Ronda Hinton"
        },
        {
            "_id": "59bed687cae9a82cfbe601cf",
            "amount": 38,
            "name": "Sandra Daniels"
        },
        {
            "_id": "59bed687fe56be3c5c02f8ae",
            "amount": 97,
            "name": "Debbie Sosa"
        },
        {
            "_id": "59bed6877bc21e9f10dcb916",
            "amount": 50,
            "name": "Jaime Rivers"
        },
        {
            "_id": "59bed687c3afcca8f3c74158",
            "amount": 1,
            "name": "Christi Kinney"
        },
        {
            "_id": "59bed687067ec214ee168a75",
            "amount": 96,
            "name": "Johnnie Hale"
        },
        {
            "_id": "59bed6878cda00f65e0b54bc",
            "amount": 37,
            "name": "Harriett Mcpherson"
        },
        {
            "_id": "59bed687b9b9a59da8d9d907",
            "amount": 88,
            "name": "Charmaine Carrillo"
        },
        {
            "_id": "59bed68729c6a1a3b0f8e445",
            "amount": 28,
            "name": "Strickland Henry"
        },
        {
            "_id": "59bed687aa6c0773c8286e7a",
            "amount": 100,
            "name": "Maryellen Hawkins"
        },
        {
            "_id": "59bed687b9c07d84cf1ac730",
            "amount": 77,
            "name": "Leigh Cortez"
        },
        {
            "_id": "59bed68787788b9d67265bee",
            "amount": 40,
            "name": "Sanford Le"
        },
        {
            "_id": "59bed687c5ad9f5da714b2f1",
            "amount": 12,
            "name": "Mathews Morris"
        },
        {
            "_id": "59bed687e3ac292015da70c5",
            "amount": 92,
            "name": "Sweeney Leonard"
        },
        {
            "_id": "59bed687d18729188a47aa9e",
            "amount": 62,
            "name": "Natalie Ross"
        },
        {
            "_id": "59bed687226e49c1d0e26374",
            "amount": 86,
            "name": "Melba Richardson"
        },
        {
            "_id": "59bed6875a0f71be0d27f13d",
            "amount": 94,
            "name": "Mcfarland Franco"
        },
        {
            "_id": "59bed68737d76c4aa18de9af",
            "amount": 83,
            "name": "Barker Blankenship"
        },
        {
            "_id": "59bed68737ca2a17d9e9bf55",
            "amount": 56,
            "name": "Giles Rice"
        },
        {
            "_id": "59bed6876a61b5d0c0992c23",
            "amount": 36,
            "name": "Webb Cohen"
        },
        {
            "_id": "59bed687d213f7f3f8d4483a",
            "amount": 41,
            "name": "Hebert Keller"
        },
        {
            "_id": "59bed687acd8abea456413bb",
            "amount": 89,
            "name": "Selena Atkinson"
        },
        {
            "_id": "59bed6873877f44e2b3157f6",
            "amount": 31,
            "name": "Marsh Carpenter"
        },
        {
            "_id": "59bed6876d3c201f7a1c24f0",
            "amount": 5,
            "name": "Wise Warner"
        },
        {
            "_id": "59bed6878d9ff0fd14eef55e",
            "amount": 14,
            "name": "Delaney Tate"
        },
        {
            "_id": "59bed687396185502fd3a168",
            "amount": 45,
            "name": "Dale Phelps"
        },
        {
            "_id": "59bed6875fe3fe6dae46c33a",
            "amount": 1,
            "name": "Jami Mcintyre"
        },
        {
            "_id": "59bed6879158c091cd5c715d",
            "amount": 19,
            "name": "Mindy Wiley"
        },
        {
            "_id": "59bed687272438d607a176ab",
            "amount": 23,
            "name": "Vaughan Booth"
        },
        {
            "_id": "59bed6876135b3dfd8b59839",
            "amount": 30,
            "name": "Mckinney Ford"
        },
        {
            "_id": "59bed687db2c659a398e0f6d",
            "amount": 13,
            "name": "Helene Mills"
        },
        {
            "_id": "59bed687624e891b89814dfb",
            "amount": 4,
            "name": "Verna Chapman"
        },
        {
            "_id": "59bed687c5f2a582f0808018",
            "amount": 60,
            "name": "Cassie King"
        },
        {
            "_id": "59bed687a672135a9d087315",
            "amount": 86,
            "name": "Stafford Schmidt"
        },
        {
            "_id": "59bed6876fb07a6f03984914",
            "amount": 82,
            "name": "Hyde Mccoy"
        },
        {
            "_id": "59bed68735ffa344e28cd5ca",
            "amount": 15,
            "name": "Caroline Mendez"
        },
        {
            "_id": "59bed6878ce1c4003629775f",
            "amount": 81,
            "name": "Sophie Gordon"
        },
        {
            "_id": "59bed687e8b651c1b7b80610",
            "amount": 76,
            "name": "Luann Orr"
        },
        {
            "_id": "59bed687b3dec8e990145a1d",
            "amount": 82,
            "name": "Alfreda Duke"
        },
        {
            "_id": "59bed6870a48c2bdc22bbbf7",
            "amount": 66,
            "name": "Cobb Bauer"
        },
        {
            "_id": "59bed687ed059f14a493877c",
            "amount": 26,
            "name": "Willie Ortega"
        },
        {
            "_id": "59bed6873a3b533b84f5b20b",
            "amount": 97,
            "name": "Silva Beasley"
        },
        {
            "_id": "59bed687170cd78fb9d77797",
            "amount": 97,
            "name": "Lena Davis"
        },
        {
            "_id": "59bed687dc8bfc56baba15f9",
            "amount": 19,
            "name": "Oconnor Medina"
        },
        {
            "_id": "59bed68707ac2c5b0481d984",
            "amount": 55,
            "name": "Dawn Stewart"
        },
        {
            "_id": "59bed6875f523678e8dbb52c",
            "amount": 37,
            "name": "Carmela Randall"
        },
        {
            "_id": "59bed6874196c14514eaac13",
            "amount": 77,
            "name": "Underwood Fuller"
        },
        {
            "_id": "59bed68700ade4f3cb8dd88c",
            "amount": 80,
            "name": "Robyn Baird"
        },
        {
            "_id": "59bed687ba9e265bedcaf045",
            "amount": 86,
            "name": "Louella Mcfarland"
        },
        {
            "_id": "59bed68713cd181ff433da4e",
            "amount": 9,
            "name": "Liza Reed"
        },
        {
            "_id": "59bed687aa91d1a46c222b35",
            "amount": 43,
            "name": "Burton Trujillo"
        },
        {
            "_id": "59bed6875bd9efa621db7e8f",
            "amount": 53,
            "name": "Grimes Cruz"
        },
        {
            "_id": "59bed6871f4a444f8d6b1d07",
            "amount": 17,
            "name": "Wanda Steele"
        },
        {
            "_id": "59bed6874efe657ea6519881",
            "amount": 14,
            "name": "Gates Brewer"
        },
        {
            "_id": "59bed6879026d9dfafdb6c81",
            "amount": 66,
            "name": "Melinda Rodriguez"
        },
        {
            "_id": "59bed687c8d0049eb88dc50b",
            "amount": 51,
            "name": "Schwartz Bowman"
        },
        {
            "_id": "59bed68747ed1bdfd79905f6",
            "amount": 47,
            "name": "Holmes Lindsay"
        },
        {
            "_id": "59bed687928873fb1d104f04",
            "amount": 62,
            "name": "Natasha Shelton"
        },
        {
            "_id": "59bed687d50ded3a56e22c1c",
            "amount": 59,
            "name": "Ashlee Alford"
        },
        {
            "_id": "59bed6877f836fe85e6ff9b1",
            "amount": 26,
            "name": "Sheppard Hudson"
        },
        {
            "_id": "59bed687322811adb4026787",
            "amount": 45,
            "name": "Aileen Dunlap"
        },
        {
            "_id": "59bed68702dfc8e9c6331993",
            "amount": 98,
            "name": "Stevens Marquez"
        },
        {
            "_id": "59bed68704eeff52ed612eef",
            "amount": 25,
            "name": "Lisa Reynolds"
        },
        {
            "_id": "59bed6875d45b2605a1c1d2d",
            "amount": 79,
            "name": "Morris Gentry"
        },
        {
            "_id": "59bed68719a47bf3bc69fb0c",
            "amount": 97,
            "name": "Kent Bowen"
        },
        {
            "_id": "59bed687b68ca0f3016482d3",
            "amount": 48,
            "name": "Dean Burch"
        },
        {
            "_id": "59bed68728ff4ab92577a89d",
            "amount": 61,
            "name": "Garcia Norman"
        },
        {
            "_id": "59bed687aa22de6040067c8e",
            "amount": 49,
            "name": "Harper Workman"
        },
        {
            "_id": "59bed68760efbf16a4415f4c",
            "amount": 85,
            "name": "Inez Mccarthy"
        },
        {
            "_id": "59bed6876199c16ae15e0d45",
            "amount": 100,
            "name": "Daniel Miranda"
        },
        {
            "_id": "59bed6873e2c456956cf8695",
            "amount": 46,
            "name": "Brady Gonzales"
        },
        {
            "_id": "59bed6873f793209a9b89f9a",
            "amount": 51,
            "name": "Fulton Noble"
        },
        {
            "_id": "59bed6870e68b930f77c69b6",
            "amount": 46,
            "name": "Barron Hodge"
        },
        {
            "_id": "59bed687f4d7320d5436e6c9",
            "amount": 38,
            "name": "Karla Shaw"
        },
        {
            "_id": "59bed6877ac0b5a81719e5db",
            "amount": 54,
            "name": "Franks Stanley"
        },
        {
            "_id": "59bed68703b5b84006f8dd91",
            "amount": 46,
            "name": "Carver Patterson"
        },
        {
            "_id": "59bed68763d8b3d585a9cda6",
            "amount": 84,
            "name": "Lott Mcdaniel"
        },
        {
            "_id": "59bed6871baa96f5957b29df",
            "amount": 45,
            "name": "Karin Bishop"
        },
        {
            "_id": "59bed6874c0f745b147840c8",
            "amount": 100,
            "name": "Byrd Vang"
        },
        {
            "_id": "59bed6879904ee0bb74a444a",
            "amount": 33,
            "name": "Wiley Alston"
        },
        {
            "_id": "59bed68762537ee6e692961c",
            "amount": 94,
            "name": "Violet Fitzgerald"
        },
        {
            "_id": "59bed68752c7fbfd41bcbcbb",
            "amount": 46,
            "name": "Hicks Howard"
        },
        {
            "_id": "59bed68720e92c714af27521",
            "amount": 15,
            "name": "Hobbs Powell"
        },
        {
            "_id": "59bed687ce73e1391ace46f1",
            "amount": 69,
            "name": "Espinoza Donovan"
        },
        {
            "_id": "59bed6875569bc218c024be8",
            "amount": 17,
            "name": "Kristie Ramos"
        },
        {
            "_id": "59bed687f7c719e5eccc5697",
            "amount": 12,
            "name": "Guadalupe Cain"
        },
        {
            "_id": "59bed6872f4bbacc8b10e675",
            "amount": 4,
            "name": "Norma Ayers"
        },
        {
            "_id": "59bed6870eb1131eb640e66a",
            "amount": 83,
            "name": "Robles Barker"
        },
        {
            "_id": "59bed68718d698b15498573c",
            "amount": 25,
            "name": "Jacqueline Melton"
        },
        {
            "_id": "59bed68778ab01b04fb44b27",
            "amount": 75,
            "name": "Daphne Casey"
        },
        {
            "_id": "59bed687694be7ca6a159414",
            "amount": 40,
            "name": "Craft Pollard"
        },
        {
            "_id": "59bed68782ac55bff8448342",
            "amount": 78,
            "name": "Mendoza Cherry"
        },
        {
            "_id": "59bed687034f5e683d315ea5",
            "amount": 72,
            "name": "Lupe Mitchell"
        },
        {
            "_id": "59bed68778becd54d5cfc255",
            "amount": 78,
            "name": "Tabitha Cobb"
        },
        {
            "_id": "59bed6879d710a3f3be6c136",
            "amount": 56,
            "name": "Mcfadden Sanders"
        },
        {
            "_id": "59bed687033e5aee2a4ab944",
            "amount": 77,
            "name": "Kay Huffman"
        },
        {
            "_id": "59bed6874b24ffca9278aef1",
            "amount": 20,
            "name": "Luisa Sparks"
        },
        {
            "_id": "59bed6873a4fcfdcfe738ce1",
            "amount": 39,
            "name": "Alexis Benton"
        },
        {
            "_id": "59bed6878bfab71fd1f3ae88",
            "amount": 75,
            "name": "Karen Collins"
        },
        {
            "_id": "59bed68700509cc597f986cc",
            "amount": 42,
            "name": "Alberta Haynes"
        },
        {
            "_id": "59bed6876b1420d73e29c898",
            "amount": 72,
            "name": "Tameka Cross"
        },
        {
            "_id": "59bed687f1e74a716a1496b9",
            "amount": 94,
            "name": "Burke Brennan"
        },
        {
            "_id": "59bed6872a3adb78f6c894a6",
            "amount": 9,
            "name": "Kirkland Shepherd"
        },
        {
            "_id": "59bed68747027b74611bba28",
            "amount": 100,
            "name": "Manuela Sutton"
        },
        {
            "_id": "59bed687cfc2bd77510ed746",
            "amount": 40,
            "name": "Bender Larsen"
        },
        {
            "_id": "59bed687613fd8c8b4a4cd86",
            "amount": 83,
            "name": "Jacobson Padilla"
        },
        {
            "_id": "59bed687256b240451a717bc",
            "amount": 11,
            "name": "Bush Bowers"
        },
        {
            "_id": "59bed68729fd1b4997f6c199",
            "amount": 15,
            "name": "Sarah Short"
        },
        {
            "_id": "59bed6876b219d31543543fb",
            "amount": 86,
            "name": "Gilliam Eaton"
        },
        {
            "_id": "59bed687dc4713e174cb0fcd",
            "amount": 56,
            "name": "Cannon Moreno"
        },
        {
            "_id": "59bed687ed96671c32792eb9",
            "amount": 47,
            "name": "Hess Rollins"
        },
        {
            "_id": "59bed68775db0f9f713ec36e",
            "amount": 18,
            "name": "Lawson Foreman"
        },
        {
            "_id": "59bed6871fdd8dba0f92f5ee",
            "amount": 79,
            "name": "Russell Wheeler"
        },
        {
            "_id": "59bed6877b090070cbe4f175",
            "amount": 10,
            "name": "Rosemary Ballard"
        },
        {
            "_id": "59bed68728966c97f11a6203",
            "amount": 84,
            "name": "Mann Nash"
        },
        {
            "_id": "59bed687150ec7e5068e492a",
            "amount": 26,
            "name": "Conner Morin"
        },
        {
            "_id": "59bed6879d82cda190f916c3",
            "amount": 70,
            "name": "Hester Monroe"
        },
        {
            "_id": "59bed68757c5ac538fa076c0",
            "amount": 92,
            "name": "Vilma Ray"
        },
        {
            "_id": "59bed6874eddc39d1be2c103",
            "amount": 21,
            "name": "Gutierrez Perry"
        },
        {
            "_id": "59bed687390e50753989caf0",
            "amount": 93,
            "name": "Claudia Lee"
        },
        {
            "_id": "59bed687631f7afc2eadb2eb",
            "amount": 93,
            "name": "Lakisha Middleton"
        },
        {
            "_id": "59bed687cc851ebc0a5f82d7",
            "amount": 23,
            "name": "Hernandez Watkins"
        },
        {
            "_id": "59bed68724e25a2cf06ee7fe",
            "amount": 87,
            "name": "Beatriz Alvarez"
        },
        {
            "_id": "59bed687df7a2e308ad39c0a",
            "amount": 72,
            "name": "Stout Logan"
        },
        {
            "_id": "59bed687cdd938eb017621c0",
            "amount": 46,
            "name": "Farrell Hendricks"
        },
        {
            "_id": "59bed68781f250ba388f568b",
            "amount": 65,
            "name": "Ross Reilly"
        },
        {
            "_id": "59bed6870a7089a8c9737788",
            "amount": 36,
            "name": "Marsha Yang"
        },
        {
            "_id": "59bed6871ae07da97acb9833",
            "amount": 10,
            "name": "Frances Sharp"
        },
        {
            "_id": "59bed68746fb2ab14d8eceb4",
            "amount": 49,
            "name": "Holt Porter"
        },
        {
            "_id": "59bed6871540fb9f958be274",
            "amount": 86,
            "name": "Berger Roberts"
        },
        {
            "_id": "59bed687173b0ec8fac66465",
            "amount": 14,
            "name": "Rocha Robertson"
        },
        {
            "_id": "59bed68777a1becb07aadb49",
            "amount": 52,
            "name": "Maldonado Abbott"
        },
        {
            "_id": "59bed687520f4a3d38b51b91",
            "amount": 87,
            "name": "Pennington Valdez"
        },
        {
            "_id": "59bed687e4127bdc7c2cbb9d",
            "amount": 42,
            "name": "Price Johns"
        },
        {
            "_id": "59bed6874c2b5ffba042c1b9",
            "amount": 96,
            "name": "Mollie Bradshaw"
        },
        {
            "_id": "59bed6875d9b23024233e977",
            "amount": 39,
            "name": "Barbra Green"
        },
        {
            "_id": "59bed687ded3557a5b72ae4e",
            "amount": 1,
            "name": "Wilkinson Barron"
        },
        {
            "_id": "59bed6876e84073d0c69db71",
            "amount": 45,
            "name": "Lillie Rich"
        },
        {
            "_id": "59bed6873b3402c83133b040",
            "amount": 98,
            "name": "Bridges Pace"
        },
        {
            "_id": "59bed6878b777a2cfe6af67b",
            "amount": 68,
            "name": "Vang Bennett"
        },
        {
            "_id": "59bed687575bbc2dd3975aa2",
            "amount": 71,
            "name": "Marci Wells"
        },
        {
            "_id": "59bed687d07d17b6558e4d44",
            "amount": 21,
            "name": "Marie Carson"
        },
        {
            "_id": "59bed6875863f3051bf5a31b",
            "amount": 68,
            "name": "Deana Peterson"
        },
        {
            "_id": "59bed68728acc8adcff32757",
            "amount": 26,
            "name": "Stacie Guerrero"
        }
    ];

    const initializeCharts = function() {
        drawSunburst(chapter);
        drawBubbleChart(bubbleData, 'amount');
    };

    initializeCharts();
    drawBubbleChart(bubbleData, 'amount');

    $(window).resize(function() {
        initializeCharts();
        drawBubbleChart(bubbleData, 'amount');
    });

});
