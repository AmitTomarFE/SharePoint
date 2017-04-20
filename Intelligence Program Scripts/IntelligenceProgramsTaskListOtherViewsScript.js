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
        
        jQuery("a.ms-listlink").each(function (ind, obj) {
            var programName = jQuery(this).text();
            if (programName == "One FireEye Intelligence Offering" || programName == "Unified Intelligence Knowledge Infrastructure" ||
                programName == "Intelligence Collection and Analysis" || programName == "Intelligence Dissemination and Integration") 
            {
                jQuery(this).parents("tr[role='row']").eq(0).remove();
            }
        });

        //code for only view 'All Program Milestones in Priority Order'
        processHtmlOfAllProgramMilestonesView();
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

//code for only view 'All Program Milestones in Priority Order'
function processHtmlOfAllProgramMilestonesView() {
    if (jQuery("a[aria-label='All Program Milestones in Priority Order, View, Selected']").length == 1) {
        var newtaskHtml = jQuery("#Hero-WPQ2 .ms-list-addnew > a");
        jQuery("#Hero-WPQ2 .ms-list-addnew").html(newtaskHtml[0].outerHTML);

        var customCss = document.createElement('style');
        customCss.type = 'text/css';
        customCss.innerHTML = '#RibbonContainer a[id$="Datasheet-Large"] { display: none !important; }';
        document.getElementsByTagName('head')[0].appendChild(customCss);

        if (jQuery("table[summary='Intelligence Programs'] > thead > tr > th").length > 0) {
            var priorityColIndex;
            jQuery("table[summary='Intelligence Programs'] > thead > tr > th").each(function (index, obj) {
                if (jQuery(this).find("div.ms-vh-div").length > 0)
                {
                    var thTitle = jQuery(this).find("div.ms-vh-div").attr("name");
                    if (thTitle === "Priority") {
                        priorityColIndex = index;
                        return false;
                    }
                }                    
            });

            var trArr = jQuery("table[summary='Intelligence Programs'] > tbody > tr");
            var indArr = [];                
            jQuery("table[summary='Intelligence Programs'] > tbody > tr > td:nth-child(" + (parseInt(priorityColIndex) + 1) + ")").each(function (index, obj) {
                indArr.push(parseInt(jQuery(this).text()));
            });

            var indArrSorted = indArr.slice();
            indArrSorted.sort(function (a, b) { return a - b });

            var trHtml = "";
            for (var i = 0; i < indArrSorted.length; ++i)
            {
                var priority = indArrSorted[i];
                var priorityIndex = indArr.indexOf(priority);
                trHtml += trArr[priorityIndex].outerHTML;                
                indArr[priorityIndex] = -9999;
            }
            jQuery("table[summary='Intelligence Programs'] > tbody").html(trHtml);
        }
    }
}
