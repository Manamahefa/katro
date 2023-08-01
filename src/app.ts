const panel: HTMLDivElement = document.querySelector(
    ".panel"
) as HTMLDivElement;

// somme des nombres dans un tableau
const somTabVal: (arg: number[]) => number = (table) => {
    let s: number = 0;
    table.forEach((ele) => {
        s += ele;
    });
    return s;
};

const time = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(() => {});
        }, 500);
    });
};

// creer un element HTML avec class_name
function createHtmlElementWithClass(
    html_tag: string,
    class_name: string,
    id?: string
): HTMLElement {
    let element: HTMLElement = document.createElement(html_tag);
    element.setAttribute("class", class_name);
    if (id) {
        element.setAttribute("id", id);
    }
    return element;
}

class Lavaka {
    private id: number;
    private owner: Player;
    private isan_vato: number = 2;
    private container: HTMLDivElement;
    private vato_container: HTMLDivElement;
    private arrow_left: HTMLDivElement | undefined;
    private arrow_right: HTMLDivElement | undefined;

    constructor(id: number, owner: Player) {
        this.id = id;
        this.owner = owner;
        this.container = createHtmlElementWithClass(
            "div",
            "lavaka"
        ) as HTMLDivElement;
        this.vato_container = createHtmlElementWithClass(
            "p",
            "num"
        ) as HTMLDivElement;

        this.testDraw(0);
    }

    private testDraw(time: number) {
        this.vato_container.innerText =
            this.isan_vato !== 0 ? this.getIsanVato().toString() : "";
        this.container.appendChild(this.vato_container);
    }
    getId() {
        return this.id;
    }
    getOwner() {
        return this.owner;
    }
    getIsanVato() {
        return this.isan_vato;
    }
    getContainer() {
        return this.container;
    }
    setIsanVato(n: number) {
        this.isan_vato = n;
        this.testDraw(2000);
    }
    onMouseEnterForActive() {
        this.container.classList.add("hover");
    }
    onMouseEnterForInactive() {
        this.container.classList.remove("hover");
    }
    onMouseOut() {
        this.container.classList.remove("hover");
    }
    drawArrow() {
        this.removeArrow();
        this.arrow_left = createHtmlElementWithClass(
            "div",
            "arrow arrow_left"
        ) as HTMLDivElement;
        this.arrow_right = createHtmlElementWithClass(
            "div",
            "arrow arrow_right"
        ) as HTMLDivElement;
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
    private name: string;
    private score: number = 16;
    private lavaka_collection: { [key: number]: Lavaka } = {};
    private lavaka_order: readonly number[] = [];
    private table_div: HTMLDivElement;
    private isNorth: boolean;

    constructor(name: string, isNorth: boolean) {
        this.name = name;
        this.isNorth = isNorth;
        this.setLavakaOrder();

        this.table_div = createHtmlElementWithClass(
            "div",
            "table"
        ) as HTMLDivElement;
        panel.appendChild(this.table_div);

        this.lavaka_order.forEach((id) => {
            this.lavaka_collection[id] = new Lavaka(id, this);
            this.table_div.appendChild(
                this.lavaka_collection[id]?.getContainer() as HTMLDivElement
            );
        });
        this.showScore(this.score);
    }

    private setLavakaOrder() {
        this.lavaka_order = this.isNorth
            ? [7, 6, 5, 4, 0, 1, 2, 3]
            : [0, 1, 2, 3, 7, 6, 5, 4];
    }
    getName() {
        return this.name;
    }
    getScore() {
        return this.score;
    }
    setScore() {
        let score: number = 0;
        for (let i = 0; i < 8; i++) {
            score += this.lavaka_collection[i]?.getIsanVato() as number;
        }
        this.score = score;
    }
    showScore(score: number) {
        this.isNorth
            ? (player1_score.innerText = score.toString())
            : (player2_score.innerText = score.toString());
    }
    getTable() {
        let table: Lavaka[] = [];
        for (let lavaka in this.lavaka_collection) {
            table.push(this.lavaka_collection[lavaka] as Lavaka);
        }
        return table;
    }
    /**
     * Type = "Lavaka" raha haka lavaka iray, "Object" raha lavaka_collection
     * @param {number | undefined} id identifiant an'lay lavaka iray ho alaina
     * @returns
     */
    getLavaka<Type>(id?: number): Type {
        return (
            id !== undefined
                ? this.lavaka_collection[id]
                : this.lavaka_collection
        ) as Type;
    }
}

class Game {
    private player: Player;
    private adve: Player;
    private vato_noraisina: number = 0;
    private current_index: number = 0; // lavaka ametrahana vato
    private steps_nbr: number = 0; // isan'ny pas vita

    constructor(player: string, adve: string) {
        this.player = new Player(player, true);
        this.adve = new Player(adve, false);
    }

    startGame() {
        let lavaka_rhtr = [...this.player.getTable(), ...this.adve.getTable()];
        lavaka_rhtr.forEach((lavaka) => {
            lavaka.getContainer().addEventListener("mouseover", () => {
                lavaka.getOwner() === this.player && lavaka.getIsanVato() != 0
                    ? lavaka.onMouseEnterForActive()
                    : lavaka.onMouseEnterForInactive();
            });
            lavaka.getContainer().addEventListener("mouseout", () => {
                lavaka.onMouseOut();
            });
            lavaka.getContainer().addEventListener("click", (e: MouseEvent) => {
                console.log(e.target);
                if (lavaka.getOwner() == this.player) {
                    if (lavaka.getIsanVato() !== 0) {
                        lavaka.drawArrow();
                    }
                    let target: HTMLElement = e.target as HTMLElement;
                    if (target.classList.contains("arrow_left")) {
                        lavaka.removeArrow();
                        lavaka.getId() > 3
                            ? this.move(lavaka.getId(), true)
                            : this.move(lavaka.getId(), false);
                    } else if (target.classList.contains("arrow_right")) {
                        lavaka.removeArrow();
                        lavaka.getId() > 3
                            ? this.move(lavaka.getId(), false)
                            : this.move(lavaka.getId(), true);
                    } else {
                        for (let i = 0; i < 8; i++) {
                            let lvk = this.player.getLavaka<Lavaka>(i);
                            if (lvk !== lavaka) lvk.removeArrow();
                        }
                    }
                }
                // else { }
            });
        });
    }
    private move(start: number, isRight: boolean) {
        //initialisation
        this.vato_noraisina = this.player
            .getLavaka<Lavaka>(start)
            .getIsanVato();
        this.player.getLavaka<Lavaka>(start).setIsanVato(0);
        this.steps_nbr = 0;

        debugger;
        this.ddd(start, isRight);
    }

    private async ddd(start: number, isRight: boolean) {
        try {
            do {
                // debugger;
                this.current_index = Math.abs(
                    (start + this.steps_nbr + (isRight ? 1 : -1) + 8) % 8
                );
                let n: number = this.player
                    .getLavaka<Lavaka>(this.current_index)
                    .getIsanVato();
                await time();
                this.player
                    .getLavaka<Lavaka>(this.current_index)
                    .setIsanVato(n + 1);
                if (this.lanyV1() && this.nisyVatoTaoAmFarany()) {
                    if (this.afakaMaka()) {
                        if (this.adveTsisyVatoEoAmbony()) {
                            this.vato_noraisina =
                                this.player
                                    .getLavaka<Lavaka>(this.current_index)
                                    .getIsanVato() +
                                this.makaAoAm(Math.abs(this.current_index - 7));
                            await time();
                            this.adve
                                .getLavaka<Lavaka>(
                                    Math.abs(this.current_index - 7)
                                )
                                .setIsanVato(0);
                        } else {
                            this.vato_noraisina =
                                this.player
                                    .getLavaka<Lavaka>(this.current_index)
                                    .getIsanVato() +
                                this.makaAoAm(this.current_index);
                            await time();
                            this.adve
                                .getLavaka<Lavaka>(this.current_index)
                                .setIsanVato(0);
                        }
                        await time();
                        this.player
                            .getLavaka<Lavaka>(this.current_index)
                            .setIsanVato(0);
                        start = this.current_index;
                        this.steps_nbr = 0;
                    } else {
                        this.vato_noraisina = this.player
                            .getLavaka<Lavaka>(this.current_index)
                            .getIsanVato();
                        await time();
                        this.player
                            .getLavaka<Lavaka>(this.current_index)
                            .setIsanVato(0);
                        start = this.current_index;
                        this.steps_nbr = 0;
                    }
                } else {
                    isRight ? (this.steps_nbr += 1) : (this.steps_nbr -= 1);
                }
            } while (!this.isMandry());
        } finally {
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
    }

    //antsoina alohan'ny incrémentation an'ny steps_nbr donc vato_noraisina - 1
    private lanyV1() {
        return Math.abs(this.steps_nbr) == this.vato_noraisina - 1;
    }
    //antsoina aorian'ny incrementatin an'ny steps_nbr (anaty isMandry())
    private lanyV2() {
        return Math.abs(this.steps_nbr) == this.vato_noraisina;
    }
    private nisyVatoTaoAmFarany() {
        return (
            this.player.getLavaka<Lavaka>(this.current_index).getIsanVato() != 1
        );
    }
    private isMandry() {
        return this.lanyV2() && !this.nisyVatoTaoAmFarany();
    }
    private nijanonaTenyAmbony() {
        return this.current_index < 4;
    }
    private afakaMaka() {
        return this.nijanonaTenyAmbony() && !this.isMandry();
    }
    private adveTsisyVatoEoAmbony() {
        let s: number = 0;
        for (let i = 0; i < 4; i++) {
            s += this.adve.getLavaka<Lavaka>(i).getIsanVato();
        }
        return s === 0;
    }
    private makaAoAm(index: number) {
        let azo: number = this.adve
            .getLavaka<Lavaka>(Math.abs(index))
            .getIsanVato();
        return azo;
    }
    private endGame() {
        return this.player.getScore() <= 1 || this.adve.getScore() <= 1;
    }
    private switchPlayer() {
        let tmp = this.player;
        this.player = this.adve;
        this.adve = tmp;
    }
}

const home: HTMLElement = document.querySelector(".home") as HTMLElement;
const btn_play: HTMLElement = document.querySelector(
    "#btn_play"
) as HTMLElement;
const player1_field: HTMLInputElement = document.querySelector(
    "#player1_field"
) as HTMLInputElement;
const player2_field: HTMLInputElement = document.querySelector(
    "#player2_field"
) as HTMLInputElement;
const player1_name: HTMLHeadingElement = document.querySelector(
    "#player1_name"
) as HTMLHeadingElement;
const player2_name: HTMLHeadingElement = document.querySelector(
    "#player2_name"
) as HTMLHeadingElement;
const player1_score: HTMLHeadingElement = document.querySelector(
    "#player1_score"
) as HTMLHeadingElement;
const player2_score: HTMLHeadingElement = document.querySelector(
    "#player2_score"
) as HTMLHeadingElement;
let mess_empty_field: string = "Ny anaranaeo azafady!!!";

player1_field.value = "";
player2_field.value = "";

function main() {
    btn_play.addEventListener("click", (e: MouseEvent) => {
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
        } else if (p1 == "" && p2 == "") {
            player1_field.placeholder = mess_empty_field;
            player2_field.placeholder = mess_empty_field;
        } else if (p2 == "") {
            player2_field.placeholder = mess_empty_field;
        } else {
            player1_field.placeholder = mess_empty_field;
        }
    });
}

main();
