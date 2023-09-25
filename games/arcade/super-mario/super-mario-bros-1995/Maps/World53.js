/**
 * Copyright (C) <ano>  Chifrudo <chifrudo@localhost.com.br>
 *
 * Este programa é um software livre: você pode redistribuí-lo e/ou
 * modificá-lo sob os termos da GNU General Public License conforme
 * publicada por a Free Software Foundation, seja a versão 3 da
 * Licença, ou (a seu critério) qualquer versão posterior.
 *
 * Este programa é distribuído na esperança de que seja útil,
 * mas SEM QUALQUER GARANTIA; mesmo sem a garantia implícita de
 * COMERCIABILIDADE ou ADEQUAÇÃO PARA UM FIM ESPECÍFICO. Veja a
 * Licença Pública Geral GNU para mais detalhes.
 *
 * Você deve ter recebido uma cópia da GNU General Public License
 * juntamente com este programa. Caso contrário, consulte
 * <https://www.gnu.org/licenses/>.
 */


map.time = 300;
map.locs = [
    new Location(0, true)
];

map.areas = [
    new Area("Overworld", function()
    {
        setLocationGeneration(0);

        pushPreCastle(0, 0);
        pushPrePattern("backcloud", 0, 4, 8);
        pushPreFloor(0, 0, 16);

        pushPreTree(144, 8, 4);
        pushPreTree(192, 32, 8);
        pushPreTree(208, 64, 5);
        fillPreThing(Coin, 217, 71, 3, 1, 8, 8);
        pushPreThing(Koopa, 240, 76, true);
        pushPreTree(256, 8, 3);
        pushPreThing(Coin, 266, 15);
        pushPreTree(280, 40, 5);
        fillPreThing(Coin, 297, 87, 2, 1, 8);
        pushPreTree(320, 72, 7);
        fillPreThing(Goomba, 352, 80, 2, 1, 16);
        pushPreTree(400, 0, 4);
        fillPreThing(Coin, 402, 55, 2, 1, 8, 8);
        pushPreThing(Platform, 440, 56, 6, [moveFloating, -4, 56]);
        pushPreTree(472, 0, 5);
        pushPreThing(Block, 472, 24, Mushroom);
        pushPreTree(480, 64, 4);
        fillPreThing(Coin, 482, 71, 4, 1, 8);
        pushPreTree(520, 0, 5);
        pushPreTree(560, 32, 3);
        pushPreThing(Koopa, 592, 76, true, [16, 88]);
        pushPreTree(608, 56, 6);
        pushPreThing(Goomba, 640, 64);
        fillPreThing(Coin, 681, 63, 2, 1, 8, 8);
        pushPreThing(Platform, 688, 40, 6, [moveSliding, 660, 720]);
        fillPreThing(Coin, 745, 71, 2, 1, 8, 8);
        pushPreThing(Platform, 752, 32, 6, [moveSliding, 700, 776]);
        fillPreThing(Coin, 777, 71, 2, 1, 8, 8);
        pushPreTree(784, 16, 4);
        pushPreTree(832, 48, 8);
        pushPreThing(Koopa, 880, 60, true);
        pushPreTree(904, 0, 3);
        fillPreThing(Coin, 906, 7, 3, 1, 8, 8);
        pushPreThing(Koopa, 912, 68, true, [4, 76]);
        pushPreTree(928, 32, 4);
        fillPreThing(Coin, 962, 63, 2, 1, 8, 8);
        pushPreTree(976, 32, 4);

        pushPreFloor(1032, 0, 47);
        pushPreThing(Platform, 1048, 56, 6, [moveSliding, 1008, 1076]);
        pushPreThing(Koopa, 1064, 12, true); 
        pushPreThing(Stone, 1112, 32, 2, 4);
        pushPreThing(Stone, 1120, 48, 2, 6);
        pushPreThing(Stone, 1136, 64, 2, 8);
        endCastleOutside(1212, 0, true, 13);
    })
];
