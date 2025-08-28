<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://kit.fontawesome.com/92f0aafca7.js" crossorigin="anonymous"></script>
    <script type="text/javascript" src="/scripts/sprintf.js"></script>
    <script type="text/javascript" src="/scripts/jquery-3.7.1.slim.min.js"></script>
    <link rel="stylesheet" href="/styles/register.css" />
</head>

<body>
    <!-- Section 3: Work Experience -->
    <section>
        <div class="header">
            <h2 class="title">
                <span class="number">3</span>Work Experience
            </h2>
            <button id="addBtn" type="button" class="btn btn-primary"><i class="fa-solid fa-plus"></i> </button>
        </div>

        <form id="AddWorkExp">
            <div class="work-item">
                <div class="item-header">
                    <h3 class="item-title">Add Experience</h3>
                </div>

                <div class="grid grid-cols-2">
                    <div class="form-group">
                        <label class="form-label required">Company Name</label>
                        <input type="text" name="companyName" class="form-input" required>
                    </div>

                    <div class="form-group">
                        <label class="form-label required">Position</label>
                        <input type="text" name="position" class="form-input" required>
                    </div>

                    <div class="form-group">
                        <label class="form-label required">Employment Type</label>
                        <select name="employeeType" class="form-select" required>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Freelance">Freelance</option>
                            <option value="Internship">Internship</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <div class="grid grid-cols-2 gap-4">
                            <div class="form-group">
                                <label class="form-label required">Start Date</label>
                                <input type="date" name="startDate" class="form-input" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">End Date</label>
                                <input type="date" name="endDate" class="form-input">
                            </div>

                        </div>
                        <div class="form-group mt-2">
                            <div class="flex items-center">
                                <input type="checkbox" name="current" value="1" class="form-checkbox">
                                <label class="ml-2">I currently work here</label>
                            </div>
                        </div>
                    </div>

                    <div class="form-group col-span-2">
                        <label class="form-label required">Job Description</label>
                        <textarea name="positionDescription" class="form-textarea" rows="3" required></textarea>
                    </div>

                    <div class="form-group col-span-2">
                        <label class="form-label">Remark</label>
                        <textarea name="workExperienceRemarks" class="form-textarea" rows="3"></textarea>
                    </div>
                </div>

                <div class="button-container">
                    <span>
                        <button type="button" class="btn btn-success" onclick="">Save</button>
                        <button type="button" class="btn btn-danger" onclick="">Cancel</button>
                    </span>
                </div>

            </div>
        </form>


        <div id="WorkExp"></div>

    </section>
    <script type="text/javascript">
        $("#addBtn").click(function() {
            $("#AddWorkExp").toggle();
        });
    </script>

    <script type="text/javascript">
        $(function() {
            var aData = [];
            aData.push({
                "id": 3,
                "userID": 1,
                "companyName": "Google",
                "position": "Software Engineer",
                "positionDescription": "Developed web applications and backend services.",
                "employeeType": "Full-time",
                "startDate": "2020-01-01",
                "endDate": "",
                "IsCurrent": true,
                "remarks": "Worked on large-scale projects."
            });
            aData.push({
                "id": 2,
                "userID": 1,
                "companyName": "Microsoft",
                "position": "Frontend Developer",
                "positionDescription": "Built UI components and dashboards.",
                "employeeType": "Contract",
                "startDate": "2018-03-01",
                "endDate": "2019-12-31",
                "IsCurrent": false,
                "remarks": ""
            });
            aData.push({
                "id": 1,
                "userID": 1,
                "companyName": "Facebook",
                "position": "Intern",
                "positionDescription": "Assisted in frontend testing and prototyping.",
                "employeeType": "Internship",
                "startDate": "2017-06-01",
                "endDate": "2017-08-31",
                "IsCurrent": false,
                "remarks": "Summer internship program."
            });

            aData = sortAssociative(aData, "id", "asc");

            var divWorkExp = $("#WorkExp");
            $.each(aData, function(iKey, oData) {
                var divContainer = generateContainer(divWorkExp, oData.id);
                divWorkExp.append(divContainer);
                generateContent(divWorkExp, divContainer, aData, oData.id);
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

        function generateContainer(divWorkExp, iID) {
            var sFormatContainer = "<div class='container' data-id='%s'></div>";
            return $(sprintf(sFormatContainer, iID));
        }

        function generateContent(divWorkExp, divContainer, aData, iID) {
            var sFormatContent = `
                <div class="work-item">
                    <div class='controller'></div>
                    <div class="item-header">
                        <h3 class="item-title">Experience %s</h3>
                    </div>

                    <div class="grid grid-cols-2">
                        <div class="form-group">
                            <label class="form-label required">Company Name</label>
                            <input type="text" name="companyName" class="form-input" value="%s" readonly>
                        </div>

                        <div class="form-group">
                            <label class="form-label required">Position</label>
                            <input type="text" name="position" class="form-input" value="%s" readonly>
                        </div>

                        <div class="form-group">
                            <label class="form-label required">Employment Type</label>
                            <input type="text" name="employeeType" class="form-input" value="%s" readonly>
                        </div>

                        <div class="form-group">
                            <div class="grid grid-cols-2 gap-4">
                                <div class="form-group">
                                    <label class="form-label required">Start Date</label>
                                    <input type="date" name="startDate" class="form-input" value="%s" readonly>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">End Date</label>
                                    <input type="date" name="endDate" class="form-input" value="%s" readonly>
                                </div>
                            </div>
                            <div class="form-group mt-2">
                                <div class="flex items-center">
                                    <input type="checkbox" name="IsCurrent" value="1" class="form-checkbox" %s disabled>
                                    <label class="ml-2">I currently work here</label>
                                </div>
                            </div>
                        </div>

                        <div class="form-group col-span-2">
                            <label class="form-label required">Job Description</label>
                            <textarea name="positionDescription" class="form-textarea" rows="3" readonly>%s</textarea>
                        </div>

                        <div class="form-group col-span-2">
                            <label class="form-label">Remark</label>
                            <textarea name="workExperienceRemarks" class="form-textarea" rows="3" readonly>%s</textarea>
                        </div>
                    </div>
                </div>
            `;

            var sFormatBtnUp = "<button class='up' data-id='%s' data-id-to='%s'>UP</button>";
            var sFormatBtnDown = "<button class='down' data-id='%s' data-id-to='%s'>DOWN</button>";

            divBtnUp = "";
            divBtnDown = "";


            var oContent = aData[iID - 1];
            var checked = oContent.IsCurrent ? "checked" : "";

            var divContent = $(sprintf(sFormatContent, oContent.id, oContent.companyName, oContent.position,
                oContent.employeeType, oContent.startDate, oContent.endDate, checked, oContent.positionDescription,
                oContent.remarks));

            if (aData.length > 1) {
                if (iID == 1) {
                    divBtnDown = generateBtn(divWorkExp, aData, sFormatBtnDown, oContent.id, false);
                } else if (iID == aData.length) {
                    divBtnUp = generateBtn(divWorkExp, aData, sFormatBtnUp, oContent.id, true);
                } else {
                    divBtnUp = generateBtn(divWorkExp, aData, sFormatBtnUp, oContent.id, true);
                    divBtnDown = generateBtn(divWorkExp, aData, sFormatBtnDown, oContent.id, false);
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

        function generateBtn(divWorkExp, RefData, sTxtBtn, iID, bIsUp) {
            var sDivBtn = sprintf(sTxtBtn, iID, parseInt(iID) + (bIsUp == true ? -1 : +1));

            return $(sDivBtn).click(function() {
                var currentID = $(this).attr("data-id");
                var ToID = $(this).attr("data-id-to");

                /* 1. Change Data in Array */
                RefData[ToID - 1].id = currentID;
                RefData[currentID - 1].id = ToID;

                RefData = sortAssociative(RefData, "id", "asc");


                /* 2. Update Data to DB */


                /* 3. Change Display */
                var childA = divWorkExp.find("div.container[data-id='" + currentID + "']");
                childA.empty();
                generateContent(divWorkExp, childA, RefData, currentID);

                var childB = divWorkExp.find("div.container[data-id='" + ToID + "']");
                childB.empty();
                generateContent(divWorkExp, childB, RefData, ToID);
            });
        }
    </script>
</body>

</html>