var HnR = HnR || {};
HnR.RiskListName = "Program Risk Management";

jQuery(document).ready(function () {
    HnR.Init();
});

HnR.Init = function () {
    HnR.SetInitialHtml();
    HnR.GetRiskListData();
}

HnR.SetInitialHtml = function () {
    var hnrHtml = "<div id='HnRSection'><div id='colHeader' class='bigFont axisLabels'>&emsp;&emsp;&emsp;&emsp;CONSEQUENCE</div><div id='rowHeader' class='bigFont axisLabels'><div id='rowHeaderInner'>PROBABILITY</div></div><div id='tblBody'><table id='HnRTable'><tr><td></td><td class='boldFont'>Insignificant</td><td class='boldFont'>Medium</td><td class='boldFont'>Major</td><td class='boldFont'>Critical</td></tr> <tr><td class='boldFont'>Almost Certain</td><td id='InAc' class='peachColor'></td><td id='MdAc' class='brownColor'></td><td id='MjAc' class='pinkColor'></td><td id='CrAc' class='pinkColor'></td></tr> <tr><td class='boldFont'>Likely</td><td id='InLk' class='peachColor'></td><td id='MdLk' class='brownColor'></td><td id='MjLk' class='pinkColor'></td><td id='CrLk' class='pinkColor'></td></tr> <tr><td class='boldFont'>Even Chance</td><td id='InEc' class='slateColor'></td><td id='MdEc' class='peachColor'></td><td id='MjEc' class='brownColor'></td><td id='CrEc' class='pinkColor'></td></tr> <tr><td class='boldFont'>Unlikely</td><td id='InUl' class='slateColor'></td><td id='MdUl' class='slateColor'></td><td id='MjUl' class='peachColor'></td><td id='CrUl' class='brownColor'></td></tr> </table></div></div>";
    jQuery("#DeltaPlaceHolderMain").append(hnrHtml);
}

HnR.GetRiskListData = function () {
    HnR.WebUrl = _spPageContextInfo.webAbsoluteUrl;

    jQuery.ajax({
        url: HnR.WebUrl + "/_api/web/lists/getbytitle('" + HnR.RiskListName + "')/items?$select=ID,Status,Consequence,Probability&$filter=((Status ne 'Completed - Avoided Risk') and (Status ne 'Completed - Mitigated/Controlled Risk') and (Status ne 'Completed - Accepted Risk') and (Status ne 'Completed - Transferred Risk'))",
        method: "get",
        headers: { "accept": "application/json; odata=verbose" },
        success: function (data) {
            var result = data.d.results;
            if (result.length > 0) {
                HnR.BuildCountersHtml(result);
            }
        },
        error: function (error) {
            console.log("error: " + json.stringify(error));
        }
    });
}

HnR.BuildCountersHtml = function (result) {
    var Counters = {};

    Counters.InAcViewName = "Insignificant and Almost Certain Risks";
    Counters.InLkViewName = "Insignificant and Likely Risks";
    Counters.InEcViewName = "Insignificant and Even Chance Risks";
    Counters.InUlViewName = "Insignificant and Unlikely Risks";
    Counters.MdAcViewName = "Medium and Almost Certain Risks";
    Counters.MdLkViewName = "Medium and Likely Risks";
    Counters.MdEcViewName = "Medium and Even Chance Risks";
    Counters.MdUlViewName = "Medium and Unlikely Risks";
    Counters.MjAcViewName = "Major and Almost Certain Risks";
    Counters.MjLkViewName = "Major and Likely Risks";
    Counters.MjEcViewName = "Major and Even Chance Risks";
    Counters.MjUlViewName = "Major and Unlikely Risks";
    Counters.CrAcViewName = "Critical and Almost Certain Risks";
    Counters.CrLkViewName = "Critical and Likely Risks";
    Counters.CrEcViewName = "Critical and Even Chance Risks";
    Counters.CrUlViewName = "Critical and Unlikely Risks";

    Counters.InAc = 0;
    Counters.InLk = 0;
    Counters.InEc = 0;
    Counters.InUl = 0;
    Counters.MdAc = 0;
    Counters.MdLk = 0;
    Counters.MdEc = 0;
    Counters.MdUl = 0;
    Counters.MjAc = 0;
    Counters.MjLk = 0;
    Counters.MjEc = 0;
    Counters.MjUl = 0;
    Counters.CrAc = 0;
    Counters.CrLk = 0;
    Counters.CrEc = 0;
    Counters.CrUl = 0;

    jQuery.each(result, function(index, item){
        if (item.Consequence == "Insignificant" && item.Probability == "Almost Certain")
            ++Counters.InAc;
        else if (item.Consequence == "Insignificant" && item.Probability == "Even Chance")
            ++Counters.InEc;
        else if (item.Consequence == "Insignificant" && item.Probability == "Likely")
            ++Counters.InLk;
        else if (item.Consequence == "Insignificant" && item.Probability == "Unlikely")
            ++Counters.InUl;
        else if (item.Consequence == "Medium" && item.Probability == "Almost Certain")
            ++Counters.MdAc;
        else if (item.Consequence == "Medium" && item.Probability == "Even Chance")
            ++Counters.MdEc;
        else if (item.Consequence == "Medium" && item.Probability == "Likely")
            ++Counters.MdLk;
        else if (item.Consequence == "Medium" && item.Probability == "Unlikely")
            ++Counters.MdUl;
        else if (item.Consequence == "Major" && item.Probability == "Almost Certain")
            ++Counters.MjAc;
        else if (item.Consequence == "Major" && item.Probability == "Even Chance")
            ++Counters.MjEc;
        else if (item.Consequence == "Major" && item.Probability == "Likely")
            ++Counters.MjLk;
        else if (item.Consequence == "Major" && item.Probability == "Unlikely")
            ++Counters.MjUl;
        else if (item.Consequence == "Critical" && item.Probability == "Almost Certain")
            ++Counters.CrAc;
        else if (item.Consequence == "Critical" && item.Probability == "Even Chance")
            ++Counters.CrEc;
        else if (item.Consequence == "Critical" && item.Probability == "Likely")
            ++Counters.CrLk;
        else if (item.Consequence == "Critical" && item.Probability == "Unlikely")
            ++Counters.CrUl;
    });

    var listUrl = HnR.WebUrl + "/Lists/" + HnR.RiskListName + "/";
    for (var key in Counters) {
        if (Counters.hasOwnProperty(key)) {
            if (Counters[key] > 0)
            {
                var viewUrl = listUrl + Counters[key + "ViewName"] + ".aspx";
                var colHtml = "<a href='" + viewUrl + "' target='_blank' style='text-decoration:underline;font-size:18px;'>" + Counters[key] + "</a>";
                jQuery("#" + key).html(colHtml);
            }
        }
    }    
}