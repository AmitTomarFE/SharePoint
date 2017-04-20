jQuery("body").addClass("hideBody");
var IntelligencePrograms = IntelligencePrograms || {};
IntelligencePrograms.WebUrl = _spPageContextInfo.webAbsoluteUrl;
IntelligencePrograms.ListName = "Intelligence Programs";
IntelligencePrograms.AdminGroupName = "Program and Performance Operations Admins";

SPClientTemplates.TemplateManager.RegisterTemplateOverrides({
    Templates: {
        Fields: {
            //'Follow_x0020_this_x0020_link_x00': {
            //    'View': function (ctx) {                    
            //        return String.format('<a href="{0}" onclick="EditItem2(event, \'{0}\');return false;">{1}</a>', ctx.CurrentItem.Follow_x0020_this_x0020_link_x00, ctx.CurrentItem.Title);
            //    }
            //},
            'Explanation_x0020_of_x0020_chang': {
                'View': function (ctx) {
                    var url1 = IntelligencePrograms.WebUrl + "/Lists/" + IntelligencePrograms.ListName + "/DispForm.aspx?ID=" + ctx.CurrentItem.ID + "#SPBookmark_Explanation_x0020_of_x0020_chang";
                    return String.format("<a href='{0}'>View Entries...</a>",url1);
                }
            },
            'Explanation_x0020_of_x0020_chang0': {
                'View': function (ctx) {
                    var url2 = IntelligencePrograms.WebUrl + "/Lists/" + IntelligencePrograms.ListName + "/DispForm.aspx?ID=" + ctx.CurrentItem.ID + "#SPBookmark_Explanation_x0020_of_x0020_chang0";
                    return String.format("<a href='{0}'>View Entries...</a>", url2);
                }
            }
        }
    },
    OnPreRender: function () {        
        jQuery("body").removeClass("hideBody");
        
    },
    OnPostRender: function () {
        jQuery(".ms-pivotControl-container > a").each(function (ind, obj) {
            if (jQuery(this).attr("aria-label").indexOf("All Documents, View") != -1) {
                jQuery(this).hide();
                return false;
            }
        });
    }
});

jQuery(document).ready(function () {
    IntelligencePrograms.Init();
});


IntelligencePrograms.Init = function () {
    ExecuteOrDelayUntilScriptLoaded(IntelligencePrograms.ShowContextRibbonSections, "sp.ribbon.js");
}

window.onhashchange = function () {    
    IntelligencePrograms.ShowContextRibbonSections();    
    console.log("hashchanges");
};

IntelligencePrograms.ShowContextRibbonSections = function () {
    var initInfo = {editable: true,isEditMode: false,allowWebPartAdder: false};

    SP.Ribbon.WebPartComponent.registerWithPageManager(initInfo);
    var wpcomp = SP.Ribbon.WebPartComponent.get_instance();

    if(wpcomp){
         var zc = document.getElementById("MSOZoneCell_WebPartWPQ2");
         wpcomp.selectWebPart(zc, true);
    }
}
