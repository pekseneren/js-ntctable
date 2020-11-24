(function() {
    $.ajax({
        'url': "./data/ntc-sample-data.json",
        'dataType': "json",
        'success': function (data) {

            $.each(data.array, function( index, value ) {
                value.totalPrice = (value.productPrice * value.qnty).toFixed(2);
            });

            var ntcTable = CreateOrderTable(data);

            var totalPrice = CalculateTotalPriceWithNTC(ntcTable);

            $("#totalPrice").html(totalPrice + " TL");  
            
            var numberAsWord = NumberToTurkishWord(totalPrice);

            $("#totalPriceAsText").html(numberAsWord);

            $(".ntc-heading2").css("display", "none");
        }
    });
})();

function CreateOrderTable(data)
{
    var ntcTable = new NTCTable(data, ["Ürün kodu", "Ürün adı", "Ürün fiyatı(TL)", "Adet", "Fiyat(TL)"]);

    var htmlString = ntcTable.generateInnerHtmlCode();

    $("#ntcTableContainer").html(htmlString);

    return ntcTable;
}

function CalculateTotalPriceWithNTC(ntcTable)
{
    var totalPrice = 0;

    $.each(ntcTable.rows.array, function( index, value ) {
        totalPrice += Number(value.cellsArray[4].cellData);
    }); 
    
    return totalPrice.toLocaleString("tr");
}

let bolum1 = ["", "bir", "iki", "üç", "dört", "beş", "altı", "yedi", "sekiz", "dokuz"];
let bolum2 = ["", "on", "yirmi", "otuz", "kırk", "elli", "altmış", "yetmiş", "seksen", "doksan"];
let bolum3 = ["", "bin", "milyon", "milyar", "trilyon", "katrilyon"];

function NumberToTurkishWord(number)
{
    var numberParts = number.split(",");
    var wholeNumberPart = String(numberParts[0]).split(".").reverse();

    if(wholeNumberPart.length > bolum3.length)
        return "Sayı sınır dışında";

    var wholeNumberArr = [ "lira"];

    for(var i = 0; i < wholeNumberPart.length; i++) 
    {
        var currentNumber = wholeNumberPart[i];
        var str = "";

        if(bolum1[currentNumber[0]])
        {
            str += " " + bolum1[currentNumber[0]] + " yüz";
        }

        if(bolum1[currentNumber[1]])
        {
            str += " " + bolum2[currentNumber[1]];
        }

        if(bolum1[currentNumber[2]])
        {
            str += " " + bolum1[currentNumber[2]];
        }

        if(str)
            wholeNumberArr.push(str + " " + bolum3[i]);
    }

    var decimalPart = numberParts[1];
    var decimalArr = [];

    if(bolum2[decimalPart[0]])
    {
        decimalArr.push(bolum2[decimalPart[0]]);
    }

    if(bolum1[decimalPart[1]])
    {
        decimalArr.push(bolum1[decimalPart[1]]);
    }

    if(decimalArr.length > 0)
    decimalArr.push("kuruş");

    if(wholeNumberArr.length == 1)
        wholeNumberArr.push("sıfır ");

    return numberAsWord = "Yalnız " + wholeNumberArr.reverse().join("") + " " + decimalArr.join(" ");
}