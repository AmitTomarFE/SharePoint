var IntelligencePrograms = IntelligencePrograms || {};
IntelligencePrograms.WebUrl = _spPageContextInfo.webAbsoluteUrl;
IntelligencePrograms.ListName = "Intelligence Programs";

jQuery(document).ready(function () {
	initEditForm();
});

function initEditForm() {
    jQuery("input[title='Follow this link for more information:']").parent().find("span").eq(1).hide();
    jQuery("input[title='Follow this link for more information:']").parents("td").eq(0).find("input[id$='UrlFieldDescription']").css("display", "none");
    jQuery("textarea[title='Explanation of changes to date for availability']").parents("tr").eq(0).hide();
    jQuery("textarea[title='Explanation of changes to date for completion']").parents("tr").eq(0).hide();
    jQuery("input[title='Number of changes to date for availability']").parents("tr").eq(0).hide();
    jQuery("input[title='Number of changes to date for completion']").parents("tr").eq(0).hide();
    
    
    jQuery("input[title='Name Required Field']").on("keydown", function(){
        setTimeout(function(){
            var valTitle = jQuery("input[title='Name Required Field']").val(); 
                jQuery("input[id$='$UrlFieldDescription']").val(valTitle);
            },500);
    });
}