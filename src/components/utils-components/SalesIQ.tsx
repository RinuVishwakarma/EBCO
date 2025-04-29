// components/SalesIQ.tsx
import { DomainAddTwoTone } from "@mui/icons-material";
import React, { useEffect } from "react";
interface SalesIQProps {
  widgetCode: string;
  domain: string;
}
const SalesIQ: React.FC<SalesIQProps> = ({ widgetCode, domain }) => {
  //   useEffect(() => {
  //     if (widgetCode) {
  //       console.log(widgetCode, "WIDGET CODE", domain, "DOMAIN");
  //       const script = document.createElement("script");
  //       script.type = "text/javascript";
  //       script.id = "zsiqscript";
  //       script.defer = true;
  //       script.src = domain;
  //       script.innerHTML = `
  //                 var $zoho=$zoho || {};
  //                 $zoho.salesiq = $zoho.salesiq || {
  //                     widgetcode: "${widgetCode}",
  //                     values: {},
  //                     ready: function() {}
  //                 };
  //             `;
  //       document
  //         .getElementsByTagName("script")[0]
  //         .parentNode?.insertBefore(script, null);
  //     }
  //   }, []);
  useEffect(() => {
    const script = document.createElement("script");
    script.setAttribute("type", "text/javascript");

    let code = `var $zoho=$zoho || {};$zoho.salesiq = $zoho.salesiq || {widgetcode: "${widgetCode}", values:{},ready:function(){}};var d=document;s=d.createElement("script");s.type="text/javascript";s.id="zsiqscript";s.defer=true;s.src="${domain}";t=d.getElementsByTagName("script")[0];t.parentNode.insertBefore(s,t);d.innerHTML = "<div id='zsiqwidget'></div>";`;

    script.appendChild(document.createTextNode(code));
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [DomainAddTwoTone]);
  return null;
};
export default SalesIQ;
