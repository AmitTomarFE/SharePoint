var IntelligencePrograms = IntelligencePrograms || {};
IntelligencePrograms.WebUrl = _spPageContextInfo.webAbsoluteUrl;
IntelligencePrograms.ListName = "Intelligence Programs";
IntelligencePrograms.ErrorMsg = "";

jQuery(document).ready(function () {
    initEditForm();
});

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function initEditForm () {
    jQuery("input[title='Follow this link for more information:']").parent().find("span").eq(1).hide();
    jQuery("input[title='Follow this link for more information:']").parents("td").eq(0).find("input[id$='UrlFieldDescription']").css("display", "none");
    jQuery("input[title='Number of changes to date for availability']").attr("disabled", "disabled").css("color", "black");
    jQuery("input[title='Number of changes to date for completion']").attr("disabled", "disabled").css("color", "black");

    jQuery("input[title='Name Required Field']").on("keydown", function () {
        setTimeout(function () {
            var valTitle = jQuery("input[title='Name Required Field']").val();
            jQuery("input[id$='$UrlFieldDescription']").val(valTitle);
        }, 500);
    });
}


(function () {
    //Define field and forms that should be used
    var myFieldCtx = {};
    myFieldCtx.Templates = {};
    myFieldCtx.Templates.Fields = {
        "Explanation_x0020_of_x0020_chang": {
            "EditForm": Field_ExpAva_Template
        },
        "Explanation_x0020_of_x0020_chang0": {
            "EditForm": Field_ExpCom_Template
        }
    };

    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(myFieldCtx);
})();
 
function Field_ExpAva_Template(ctx) {
    var fieldTitle = "Explanation of changes to date for availability";
    var dependentFieldInternalName = "We_x0020_expect_x0020_it_x0020_t";
    var dependentFieldTitle = "We expect it to be available by:";

    var formCtx = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx);

    // Register a callback just before submit.
    formCtx.registerGetValueCallback(formCtx.fieldName, function () {
        return document.getElementById("idExpAva").value;
    });

    // Create container which is handling the new validator
    var validators = new SPClientForms.ClientValidation.ValidatorSet();
    validators.RegisterValidator(new Field_ExpAva_Validator(fieldTitle, dependentFieldTitle, dependentFieldInternalName));

    // This handler is called if the validation fails
    formCtx.registerValidationErrorCallback(formCtx.fieldName, Field_ExpAva_ValidationError);

    // Link the validator with the field 
    formCtx.registerClientValidator(formCtx.fieldName, validators);

    // Perform the custom field rendering
    var htmlString = "<span dir='none'>";
    htmlString += "<textarea rows='6' cols='20' value='" + formCtx.fieldValue + "' id='idExpAva' class='ms-long' title='" + fieldTitle + "'></textarea><br>";
    htmlString += "<span id='idExpAvaValidationError' class='ms-formvalidation ms-csrformvalidation'></span>";
    htmlString += "</span>";
    return htmlString;
}

// Custom validation object to validate the field 
function Field_ExpAva_Validator (fieldTitle, dependentFieldTitle, dependentFieldInternalName) {
    Field_ExpAva_Validator.prototype.Validate = function (currExpAvaValue) {
        //Checking Default Fields (including other field validations)
        IntelligencePrograms.ErrorMsg = "";
        ValidateDefaultRequiredFields();

        var errorOccurred = false;
        var errorMessage = "";

        if (!CustomFieldValidator(currExpAvaValue, dependentFieldTitle, dependentFieldInternalName)) {
            errorOccurred = true;
            errorMessage = "You can't leave this blank.";

            IntelligencePrograms.ErrorMsg += "<br/><br/>Please provide explanation for change in date '<b>" + dependentFieldTitle + "</b>' in the following field - ";
            IntelligencePrograms.ErrorMsg += "<br/><span style='color:red'>" + fieldTitle + "</span>";
        }       

        //Send error message to error callback function 
        return new SPClientForms.ClientValidation.ValidationResult(errorOccurred, errorMessage);
    };
};

// Add error message to myFieldValidationError element below the input field element 
function Field_ExpAva_ValidationError(error) {
    document.getElementById("idExpAvaValidationError").innerHTML = "<span role='alert'>" + error.errorMessage + "</span>";
}


function Field_ExpCom_Template(ctx) {
    var fieldTitle = "Explanation of changes to date for completion";
    var dependentFieldInternalName = "We_x0020_expect_x0020_to_x0020_c";
    var dependentFieldTitle = "We expect to complete it by:";

    var formCtx = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx);

    // Register a callback just before submit.
    formCtx.registerGetValueCallback(formCtx.fieldName, function () {
        return document.getElementById("idExpCom").value;
    });

    // Create container which is handling the new validator
    var validators = new SPClientForms.ClientValidation.ValidatorSet();
    validators.RegisterValidator(new Field_ExpCom_Validator(fieldTitle, dependentFieldTitle, dependentFieldInternalName));

    // This handler is called if the validation fails
    formCtx.registerValidationErrorCallback(formCtx.fieldName, Field_ExpCom_ValidationError);

    // Link the validator with the field 
    formCtx.registerClientValidator(formCtx.fieldName, validators);

    // Perform the custom field rendering
    var htmlString = "<span dir='none'>";
    htmlString += "<textarea rows='6' cols='20' value='" + formCtx.fieldValue + "' id='idExpCom' class='ms-long' title='" + fieldTitle + "'></textarea><br>";
    htmlString += "<span id='idExpComValidationError' class='ms-formvalidation ms-csrformvalidation'></span>";
    htmlString += "</span>";
    return htmlString;
}

// Custom validation object to validate the field 
function Field_ExpCom_Validator(fieldTitle, dependentFieldTitle, dependentFieldInternalName) {
    Field_ExpCom_Validator.prototype.Validate = function (currExpComValue) {
        var errorOccurred = false;
        var errorMessage = "";

        if (!CustomFieldValidator(currExpComValue, dependentFieldTitle, dependentFieldInternalName)) {
            errorOccurred = true;
            errorMessage = "You can't leave this blank.";

            IntelligencePrograms.ErrorMsg += "<br/><br/>Please provide explanation for change in date '<b>" + dependentFieldTitle + "</b>' in the following field - ";
            IntelligencePrograms.ErrorMsg += "<br/><span style='color:red'>" + fieldTitle + "</span>";            
        }

        if(IntelligencePrograms.ErrorMsg != "")
            SP.UI.ModalDialog.showModalDialog({ title: "Error", width: 800, height: 200, html: jQuery("<div>" + IntelligencePrograms.ErrorMsg + "</div>").get(0) });

        //Send error message to error callback function 
        return new SPClientForms.ClientValidation.ValidationResult(errorOccurred, errorMessage);
    };
};

// Add error message to myFieldValidationError element below the input field element 
function Field_ExpCom_ValidationError(error) {
    document.getElementById("idExpComValidationError").innerHTML = "<span role='alert'>" + error.errorMessage + "</span>";
}

function CustomFieldValidator(currCommentsValue, dependentFieldTitle, dependentFieldInternalName) {
    var isFieldValid = false;

    var qp = getUrlVars();
    var currentItemId = parseInt(qp["ID"]);

    jQuery.ajax({
        url: IntelligencePrograms.WebUrl + "/_api/web/lists/getByTitle('" + IntelligencePrograms.ListName + "')/items?$filter=ID eq " + currentItemId + "&$select=ID," + dependentFieldInternalName,
        method: "get",
        async: false,
        headers: { "accept": "application/json; odata=verbose" },
        success: function (data) {
            
            if (data.d.results.length > 0) {
                var itemData = data.d.results[0];

                var exp1,exp2;
                var e1 = jQuery("input[title='" + dependentFieldTitle + "']").val();
                if (e1 === "" || e1 == undefined || new Date(e1) == "Invalid Date")
                    exp1 = e1;
                else {
                    var arr1 = e1.split("/");
                    if (parseInt(arr1[0]) < 10)
                        arr1[0] = "0" + arr1[0];
                    if (parseInt(arr1[1]) < 10)
                        arr1[1] = "0" + arr1[1];

                    exp1 = arr1[2] + "-" + arr1[0] + "-" + arr1[1];
                }

                var e2 = itemData[dependentFieldInternalName];
                if (e2 === "" || e2 == null || e2 == undefined)
                    exp2 = "";
                else {
                    var arr2 = e2.split("T");
                    exp2 = arr2[0];
                }

                if (exp1 !== exp2 && currCommentsValue === "") {
                    isFieldValid = false;
                }
                else {
                    isFieldValid = true;
                }
            }            
        },
        error: function (error) {            
            console.log("error: " + JSON.stringify(error));
            isFieldValid = false;
            alert("An error occured while validating the form. Please refresh and try again.");
        }
    });

    return isFieldValid;
}

function ValidateDefaultRequiredFields() {
    var name = jQuery("input[title='Name Required Field']").val();
    var isNameValid = name == "" ? false : true;

    var checkHowIsItDoing = jQuery("input[id^='How_x2019_s_x0020_it_x0020_doing'][id$='_FillInButton'").prop("checked");
    var howIsItDoingVal = jQuery("input[id^='How_x2019_s_x0020_it_x0020_doing'][type='text'").val();
    var isHowIsItDoingValid = (checkHowIsItDoing && howIsItDoingVal == "") ? false : true;

    var startDate = jQuery("input[title='Start date Required Field']").val();
    var isStartDateValid = (startDate == "" || new Date(startDate) == "Invalid Date") ? false : true;

    if (!isNameValid || !isHowIsItDoingValid || !isStartDateValid)
        IntelligencePrograms.ErrorMsg += "Please fill the below required fields - ";
    if (!isNameValid)
        IntelligencePrograms.ErrorMsg += "<br/><span style='color:red'>Name</span>";
    if (!isHowIsItDoingValid)
        IntelligencePrograms.ErrorMsg += "<br/><span style='color:red'>How's it doing</span>";
    if (!isStartDateValid)
        IntelligencePrograms.ErrorMsg += "<br/><span style='color:red'>Start Date</span>";
}
