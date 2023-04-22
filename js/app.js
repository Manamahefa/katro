"use strict";
const panel = document.querySelector('.panel');
// somme des nombres dans un tableau
const somTabVal = (table) => {
    let s = 0;
    table.forEach(ele => { s += ele; });
    return s;
};
// creer un element HTML avec class_name
function createHtmlElementWithClass(html_tag, class_name, id) {
    let element = document.createElement(html_tag);
    element.setAttribute("class", class_name);
    if (id) {
        element.setAttribute("id", id);
    }
    return element;
}
class Lavaka {
    constructor(id, owner) {
        this.isan_vato = 2;
        this.id = id;
        this.owner = owner;
        this.container = createHtmlElementWithClass("div", "lavaka");
        this.vato_container = createHtmlElementWithClass("p", "num");
        this.testDraw(0);
    }
    testDraw(time) {
        this.vato_container.innerText = (this.isan_vato !== 0) ? this.getIsanVato().toString() : "";
        this.container.appendChild(this.vato_container);
    }
    getId() { return this.id; }
    getOwner() { return this.owner; }
    getIsanVato() { return this.isan_vato; }
    getContainer() { return this.container; }
    setIsanVato(n) { this.isan_vato = n; this.testDraw(2000); }
    onMouseEnterForActive() { this.container.classList.add('hover'); }
    onMouseEnterForInactive() { this.container.classList.remove("hover"); }
    onMouseOut() { this.container.classList.remove('hover'); }
    drawArrow() {
        this.removeArrow();
        this.arrow_left = createHtmlElementWithClass("div", "arrow arrow_left");
        this.arrow_right = createHtmlElementWithClass("div", "arrow arrow_right");
        this.container.appendChild(this.arrow_left);
        this.container.appendChild(this.arrow_right);
    }
    removeArrow() {
        if (this.arrow_left != undefined && this.arrow_right != undefined) {
            this.container.removeChild(this.arrow_left);
            this.container.removeChild(this.arrow_right);
        }
        this.arrow_left = undefined;
        this.arrow_right = undefined;
    }
}
class Player {
    constructor(name, isNorth) {
        this.score = 16;
        this.lavaka_collection = {};
        this.lavaka_order = [];
        this.name = name;
        this.isNorth = isNorth;
        this.setLavakaOrder();
        this.table_div = createHtmlElementWithClass("div", "table");
        panel.appendChild(this.table_div);
        this.lavaka_order.forEach(id => {
            var _a;
            this.lavaka_collection[id] = new Lavaka(id, this);
            this.table_div.appendChild((_a = this.lavaka_collection[id]) === null || _a === void 0 ? void 0 : _a.getContainer());
        });
        this.showScore(this.score);
    }
    setLavakaOrder() {
        this.lavaka_order = this.isNorth ? [7, 6, 5, 4, 0, 1, 2, 3] : [0, 1, 2, 3, 7, 6, 5, 4];
    }
    getName() { return this.name; }
    getScore() { return this.score; }
    setScore() {
        var _a;
        let score = 0;
        for (let i = 0; i < 8; i++) {
            score += (_a = this.lavaka_collection[i]) === null || _a === void 0 ? void 0 : _a.getIsanVato();
        }
        this.score = score;
    }
    showScore(score) {
        (this.isNorth) ?
            player1_score.innerText = score.toString() :
            player2_score.innerText = score.toString();
    }
    getTable() {
        let table = [];
        for (let lavaka in this.lavaka_collection) {
            table.push(this.lavaka_collection[lavaka]);
        }
        return table;
    }
    /**
     * Type = "Lavaka" raha haka lavaka iray, "Object" raha lavaka_collection
     * @param {number | undefined} id identifiant an'lay lavaka iray ho alaina
     * @returns
     */
    getLavaka(id) {
        return ((id !== undefined) ? this.lavaka_collection[id] : this.lavaka_collection);
    }
}
class Game {
    constructor(player, adve) {
        this.vato_noraisina = 0;
        this.current_index = 0;
        this.steps_nbr = 0;
        this.player = new Player(player, true);
        this.adve = new Player(adve, false);
    }
    startGame() {
        let lavaka_rhtr = [...this.player.getTable(), ...this.adve.getTable()];
        lavaka_rhtr.forEach(lavaka => {
            lavaka.getContainer().addEventListener("mouseover", () => {
                (lavaka.getOwner() === this.player && lavaka.getIsanVato() != 0) ?
                    lavaka.onMouseEnterForActive() :
                    lavaka.onMouseEnterForInactive();
            });
            lavaka.getContainer().addEventListener("mouseout", () => {
                lavaka.onMouseOut();
            });
            lavaka.getContainer().addEventListener("click", (e) => {
                console.log(e.target);
                if (lavaka.getOwner() == this.player) {
                    if (lavaka.getIsanVato() !== 0) {
                        lavaka.drawArrow();
                    }
                    let target = e.target;
                    if (target.classList.contains("arrow_left")) {
                        lavaka.removeArrow();
                        (lavaka.getId() > 3) ?
                            this.move(lavaka.getId(), true) :
                            this.move(lavaka.getId(), false);
                    }
                    else if (target.classList.contains("arrow_right")) {
                        lavaka.removeArrow();
                        (lavaka.getId() > 3) ?
                            this.move(lavaka.getId(), false) :
                            this.move(lavaka.getId(), true);
                    }
                    else {
                        for (let i = 0; i < 8; i++) {
                            let lvk = this.player.getLavaka(i);
                            if (lvk !== lavaka)
                                lvk.removeArrow();
                        }
                    }
                }
                // else { }
            });
        });
    }
    move(start, isRight) {
        //initialisation
        this.vato_noraisina = this.player.getLavaka(start).getIsanVato();
        this.player.getLavaka(start).setIsanVato(0);
        this.steps_nbr = 0;
        let time = setInterval(() => {
            debugger;
            this.current_index = Math.abs((start + this.steps_nbr + (isRight ? 1 : -1) + 8) % 8);
            let n = this.player.getLavaka(this.current_index).getIsanVato();
            this.player.getLavaka(this.current_index).setIsanVato(n + 1);
            if (this.lanyV1() && this.nisyVatoTaoAmFarany()) {
                if (this.afakaMaka()) {
                    if (this.adveTsisyVatoEoAmbony()) {
                        this.vato_noraisina = this.player.getLavaka(this.current_index).getIsanVato() + this.makaAoAm(Math.abs(this.current_index - 7));
                    }
                    else {
                        this.vato_noraisina = this.player.getLavaka(this.current_index).getIsanVato() + this.makaAoAm(this.current_index);
                    }
                    this.player.getLavaka(this.current_index).setIsanVato(0);
                    start = this.current_index;
                    this.steps_nbr = 0;
                }
                else {
                    this.vato_noraisina = this.player.getLavaka(this.current_index).getIsanVato();
                    this.player.getLavaka(this.current_index).setIsanVato(0);
                    start = this.current_index;
                    this.steps_nbr = 0;
                }
            }
            else {
                isRight ? this.steps_nbr += 1 : this.steps_nbr -= 1;
            }
            if (this.isMandry()) {
                clearInterval(time);
                this.player.setScore();
                this.adve.setScore();
                this.player.showScore(this.player.getScore());
                this.adve.showScore(this.adve.getScore());
                this.vato_noraisina = 0;
                this.current_index = 0;
                if (this.endGame()) {
                    alert(`${this.player.getName()} nandresy`);
                }
                this.switchPlayer();
            }
        }, 1000);
    }
    lanyV1() {
        return (Math.abs(this.steps_nbr) == this.vato_noraisina - 1);
    }
    lanyV2() {
        return (Math.abs(this.steps_nbr) == this.vato_noraisina);
    }
    nisyVatoTaoAmFarany() {
        return (this.player.getLavaka(this.current_index).getIsanVato() != 1);
    }
    isMandry() {
        return (this.lanyV2() && !this.nisyVatoTaoAmFarany());
    }
    nijanonaTenyAmbony() {
        return (this.current_index < 4);
    }
    afakaMaka() {
        return (this.nijanonaTenyAmbony() && !this.isMandry());
    }
    adveTsisyVatoEoAmbony() {
        let s = 0;
        for (let i = 0; i < 4; i++) {
            s += this.adve.getLavaka(i).getIsanVato();
        }
        return s === 0;
    }
    makaAoAm(index) {
        let azo = this.adve.getLavaka(Math.abs(index)).getIsanVato();
        this.adve.getLavaka(Math.abs(index)).setIsanVato(0);
        return azo;
    }
    endGame() {
        return this.player.getScore() <= 1 || this.adve.getScore() <= 1;
    }
    switchPlayer() {
        let tmp = this.player;
        this.player = this.adve;
        this.adve = tmp;
    }
}
const home = document.querySelector(".home");
const btn_play = document.querySelector("#btn_play");
const player1_field = document.querySelector("#player1_field");
const player2_field = document.querySelector("#player2_field");
const player1_name = document.querySelector("#player1_name");
const player2_name = document.querySelector("#player2_name");
const player1_score = document.querySelector("#player1_score");
const player2_score = document.querySelector("#player2_score");
let mess_empty_field = "Ny anaranaeo azafady!!!";
player1_field.value = "";
player2_field.value = "";
function main() {
    btn_play.addEventListener("click", (e) => {
        e.preventDefault();
        let p1, p2;
        p1 = player1_field.value;
        p2 = player2_field.value;
        if (p1 != "" && p2 != "") {
            home.classList.add("hide");
            player1_name.innerText = p1;
            player2_name.innerText = p2;
            const lalao = new Game(p1, p2);
            lalao.startGame();
        }
        else if (p1 == "" && p2 == "") {
            player1_field.placeholder = mess_empty_field;
            player2_field.placeholder = mess_empty_field;
        }
        else if (p2 == "") {
            player2_field.placeholder = mess_empty_field;
        }
        else {
            player1_field.placeholder = mess_empty_field;
        }
    });
}
main();
