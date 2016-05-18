var cardTypes;

$(document).ready(function () {
    cardTypes = new CardTypes();

    $("#deck-size").on("change paste keypress", numberInputChange);
    $("#hand-size").on("change paste keypress", numberInputChange);

    $("body").on("change paste keypress", ".card-types-amt", numberInputChange);
    $("body").on("change paste keypress", ".card-types-min", numberInputChange);
    $("body").on("change paste keypress", ".card-types-max", numberInputChange);

    $("body").on("keyup", ".number-input", function (e) {
        if (e.keyCode == 38 || e.keyCode == 40) {
            var val = e.target.value;
            if (val === "") {
                val = 0;
            }

            val = parseInt(val, 10);
            val += (e.keyCode == 38) ? 1 : -1;

            e.target.value = val;

            if (e.target.id.indexOf("amt") != -1) {
                var c = e.target.id.split("-")[2];

                var min = $("#card-type-" + c + "-min");
                if (min.val() == "") {
                    min.val(1);
                }

                var max = $("#card-type-" + c + "-max");
                if (max.val() == "") {
                    max.val(e.target.value);
                }
            }
            
            updateNumbers();
        }
    });

    $("body").on("keyup", "#deck-size, #hand-size, .card-types-amt, .card-types-min, .card-types-max", function (e) {
        if (e.keyCode === 8 || e.keyCode === 46) {
            updateNumbers();
        }
    });

    $("#card-types-add-button").click(function (e) {
        e.preventDefault();

        cardTypes.addCardType();
    });

    $("#card-types-sub-button").click(function (e) {
        e.preventDefault();

        cardTypes.removeCardType();
    });
});

function numberInputChange(e) {
    e.preventDefault();

    if (e.charCode >= '0'.charCodeAt(0) && e.charCode <= '9'.charCodeAt(0)) {
        var start = e.target.selectionStart;
        var end = e.target.selectionEnd;
        e.target.value = e.target.value.substring(0, start) + String.fromCharCode(e.charCode) + e.target.value.substring(end, e.target.value.length);
        e.target.selectionEnd = start + 1;
        //e.target.value = e.target.value String.fromCharCode(e.charCode);
    }

    if (e.target.id.indexOf("amt") != -1) {
        var c = e.target.id.split("-")[2];

        var min = $("#card-type-" + c + "-min");
        if (min.val() == "") {
            min.val(1);
        }

        var max = $("#card-type-" + c + "-max");
        if (max.val() == "") {
            max.val(e.target.value);
        }
    }

    updateNumbers();
}

function updateNumbers() {
    var deckSize = getDeckSize();
    var handSize = getHandSize();

    var miscAmt = deckSize;
    for (var i = 0; i <= cardTypes.count; i++) {
        miscAmt -= getCardAmt(i);
    }

    var miscMax = handSize;
    for (var i = 0; i <= cardTypes.count; i++) {
        miscMax -= getCardMin(i);
    }

    var maxError = false;
    for (var i = 0; i <= cardTypes.count; i++) {
        var cardAmt = getCardAmt(i);
        var cardMax = getCardMax(i);

        if (cardMax > cardAmt) {
            $("#card-type-" + i + "-max").css("border-color", "red");
            maxError = true;
        } else {
            $("#card-type-" + i + "-max").css("border-color", "");
        }
    }

    if (getHandSize() > getDeckSize()) {
        $("#hand-size").css("border-color", "red");
    } else {
        $("#hand-size").css("border-color", "");
    }

    var failHand = miscAmt < miscMax;
    for (var i = 0; i <= cardTypes.count; i++) {
        $("#card-type-" + i + "-min").css("border-color", failHand ? "red" : "");
    }

    var maxMinFail = false;
    for (var i = 0; i <= cardTypes.count; i++) {
        if (getCardMin(i) > getCardMax(i)) {
            maxMinFail = true;
            $("#card-type-" + i + "-min").css("border-color", "red");
        } else {
            $("#card-type-" + i + "-min").css("border-color", "");
        }
    }

    if (miscAmt < 0 || miscMax < 0 || maxError || getHandSize() > getDeckSize() || failHand || maxMinFail) {
        valid = false;
    } else {
        valid = true;
    }

    setMiscAmt(miscAmt);
    setMiscMax(miscMax);

    calculate();
}

function getDeckSize() {
    var ret = $("#deck-size").val();
    if (ret === "") {
        ret = 0;
    }

    return ret;
}

function getHandSize() {
    var ret = $("#hand-size").val();
    if (ret === "") {
        ret = 0;
    }

    return parseInt(ret, 10);
}

function getMiscAmt() {
    var ret = $("#misc-amt").text();
    if (ret === "") {
        ret = 0;
    }

    return parseInt(ret, 10);
}

function setMiscAmt(val) {
    if (val < 0) {
        $("#misc-amt").css("color", "red");
    } else {
        $("#misc-amt").css("color", "black");
    }

    $("#misc-amt").text(val);
}

function getMiscMin() {
    var ret = $("#misc-min").text();
    if (ret === "") {
        ret = 0;
    }

    return parseInt(ret, 10);
}

function setMiscMin(val) {
    if (val < 0) {
        $("#misc-min").css("color", "red");
    } else {
        $("#misc-min").css("color", "black");
    }

    $("#misc-min").text(val);
}

function getMiscMax() {
    var ret = $("#misc-max").text();
    if (ret === "") {
        ret = 0;
    }

    return parseInt(ret, 10);
}

function setMiscMax(val) {
    if (val < 0) {
        $("#misc-max").css("color", "red");
    } else {
        $("#misc-max").css("color", "black");
    }

    $("#misc-max").text(val);
}

function getCardAmt(index) {
    var ret = $("#card-type-" + index + "-amt").val();
    if (ret === "") {
        ret = 0;
    }

    return parseInt(ret, 10);
}

function getCardMin(index) {
    var ret = $("#card-type-" + index + "-min").val();
    if (ret === "") {
        ret = 0;
    }

    return parseInt(ret, 10);
}

function getCardMax(index) {
    var ret = $("#card-type-" + index + "-max").val();
    if (ret === "") {
        ret = 0;
    }

    return parseInt(ret, 10);
}

var valid = true;
function calculate() {
    if (!valid) {
        $("#percentage").html('<label style="color: red">Unable to calculate. Please fix the values.</label>');
    } else {
        var objects = [];
        for (var i = 0; i <= cardTypes.count; i++) {
            var obj = {
                amt: getCardAmt(i),
                min: getCardMin(i),
                max: getCardMax(i)
            };

            objects.push(obj);
        }

        var chance = 0;
        if (getMiscMax() === 0 && getDeckSize() == getHandSize()) {
            chance = 100;
        } else {
            var recursive = recursiveCalculate([], 0, objects);
            chance = (recursive / choose(getDeckSize(), getHandSize())) * 100;
            console.log(recursive);
        }

        var color = ["red", "#ff9900", "#ffbf00", "green", "green"][Math.floor(chance / 25)];

        $("#percentage").html('<label>You have a <span style="color: ' + color + '">' + chance.toFixed(2) + '</span>% chance to open this hand.</label>');
    }
}

function recursiveCalculate(currentHand, currentHandSize, objects) {
    if (objects.length === 0 || currentHandSize >= getHandSize()) {
        if (currentHandSize == getHandSize()) {
            console.log("O: " + objects.length);
            var noChance = false;
            for (var i = 0; i < objects.length; i++) {
                if (objects[i].min != 0) {
                    noChance = true;
                    break;
                }
            }
            
            if (noChance) {
                return 0;
            }
        } else if (currentHandSize > getHandSize()) {
            return 0;
        }
        
        var newChance = 1;
        var output = "";

        for (var i = 0; i < currentHand.length; i += 2) {
            output += "(" + currentHand[i] + " choose " + currentHand[i + 1] + ") * ";
            newChance *= choose(currentHand[i], currentHand[i + 1]);
        }

        if (currentHandSize < getHandSize()) {
            output += "(" + getMiscAmt() + "choose " + (getHandSize() - currentHandSize) + ") * ";
            newChance *= choose(getMiscAmt(), getHandSize() - currentHandSize);
        }

        console.log(output.substring(0, output.length - 3));
        return newChance;
    }

    var obj = objects.pop();
    var chance = 0;

    for (var i = obj.min; i <= obj.max; i++) {

        currentHand.push(obj.amt);
        currentHand.push(i);

        chance += recursiveCalculate(currentHand, currentHandSize + i, objects);
        //console.log("N: " + chance);

        currentHand.pop();
        currentHand.pop();

    }

    objects.push(obj);

    return chance;
}

function factorial(x) {
    x = parseInt(x, 10);
    if (isNaN(x))
        return 1;
    if (x <= 0)
        return 1;
    if (x > 170)
        return Infinity;
    var y = 1;
    for (var i = x; i > 0; i--) {
        y *= i;
    }
    return y;
}

function choose(n, k) {
    n = parseInt(n, 10);
    if (isNaN(n))
        n = 0;
    if (n < 0)
        n = 0;

    k = parseInt(k, 10);
    if (isNaN(k))
        k = 0;
    if (k < 0)
        k = 0;
    //if (k > n) k = n;

    return (factorial(n)) / (factorial(k) * factorial(n - k));
}

function CardTypes() {
    this.count = 0;

    this.addCardType = function () {
        this.count++;

        $("#card-types-container").append(Templates.cardType(this.count));
        if (this.count > 0) {
            $("#card-types-sub-button").removeAttr("disabled");
        }
    }

    this.removeCardType = function () {
        $("#card-type-" + this.count + "-container").remove();
        this.count--;

        if (this.count < 1) {
            $("#card-types-sub-button").attr("disabled", true);
        }
    }
}