<script type="text/javascript" src="/scripts/sprintf.js"></script>
<script type="text/javascript" src="/scripts/jquery-3.7.1.slim.min.js"></script>

<script type="text/javascript">
    $(function() {
        var aData = [];
        aData.push({
            "Order": 2,
            "Title": "A1",
            "Content": "C1"
        });
        aData.push({
            "Order": 1,
            "Title": "A2",
            "Content": "C2"
        });
        aData.push({
            "Order": 3,
            "Title": "A3",
            "Content": "C3"
        });

        aData = sortAssociative(aData, "Order", "asc");

        var divMain = $("#main");
        $.each(aData, function(iKey, oData) {
            var divContainer = generateContainer(divMain, oData.Order);
            divMain.append(divContainer);
            generateContent(divMain, divContainer, aData, oData.Order);
        });
    });

    function sortAssociative(data, sortBy, orderBy) {
        let sortedEntries;

        // Handle object
        if (!Array.isArray(data)) {
            sortedEntries = Object.entries(data).sort(([kA, vA], [kB, vB]) => {
                let compare;
                if (sortBy === "key") compare = kA.localeCompare(kB);
                else compare = (vA > vB) - (vA < vB); // value sort

                return orderBy === "asc" ? compare : -compare;
            });
            return Object.fromEntries(sortedEntries);
        }

        // Handle array of objects (sort by property name in 'by')
        sortedEntries = [...data].sort((a, b) => {
            let valA = a[sortBy];
            let valB = b[sortBy];
            let compare = (valA > valB) - (valA < valB);
            return orderBy === "asc" ? compare : -compare;
        });

        return sortedEntries;
    }

    function generateContainer(divMain, iOrder) {
        var sFormatContainer = "<div class='container' data-order='%s'></div>";
        return $(sprintf(sFormatContainer, iOrder));
    }

    function generateContent(divMain, divContainer, aData, iOrder) {
        var sFormatContent = "<div><span class='title'>%s</span><div class='controller'></div><div class='content'>%s</div></div>";
        var sFormatBtnUp = "<button class='up' data-order='%s' data-orderTo='%s'>UP</button>";
        var sFormatBtnDown = "<button class='down' data-order='%s' data-orderTo='%s'>DOWN</button>";

        divBtnUp = "";
        divBtnDown = "";

        var oContent = aData[iOrder - 1];

        var divContent = $(sprintf(sFormatContent, oContent.Title, oContent.Content));

        if (aData.length > 1) {
            if (iOrder == 1) {
                divBtnDown = generateBtn(divMain, aData, sFormatBtnDown, oContent.Order, false);
            } else if (iOrder == aData.length) {
                divBtnUp = generateBtn(divMain, aData, sFormatBtnUp, oContent.Order, true);
            } else {
                divBtnUp = generateBtn(divMain, aData, sFormatBtnUp, oContent.Order, true);
                divBtnDown = generateBtn(divMain, aData, sFormatBtnDown, oContent.Order, false);
            }
        }

        if (divBtnUp != "") {
            divContent.find(".controller").append(divBtnUp);
        }

        if (divBtnDown != "") {
            divContent.find(".controller").append(divBtnDown);
        }

        divContainer.append(divContent);
    }

    function generateBtn(divMain, RefData, sTxtBtn, iOrder, bIsUp) {
        var sDivBtn = sprintf(sTxtBtn, iOrder, parseInt(iOrder) + (bIsUp == true ? -1 : +1));

        return $(sDivBtn).click(function() {
            var currentOrder = $(this).attr("data-order");
            var ToOrder = $(this).attr("data-orderTo");

            /* 1. Change Data in Array */
            RefData[ToOrder - 1].Order = currentOrder;
            RefData[currentOrder - 1].Order = ToOrder;

            RefData = sortAssociative(RefData, "Order", "asc");

            /* 2. Update Data to DB */

            /* 3. Change Display */
            var childA = divMain.find("div.container[data-order='" + currentOrder + "']");
            childA.empty();
            generateContent(divMain, childA, RefData, currentOrder);

            var childB = divMain.find("div.container[data-order='" + ToOrder + "']");
            childB.empty();
            generateContent(divMain, childB, RefData, ToOrder);
        });
    }
</script>

<div id="main"></div>