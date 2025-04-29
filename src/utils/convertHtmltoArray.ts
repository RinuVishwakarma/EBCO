export const convertHtmltoArray = (html: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Extract the text content from each <li> element and add a space after each item
    const items = Array.from(tempDiv.querySelectorAll('li')).map(li => li.textContent?.trim() + ' ');

    // console.log(items);
    return items;
}

export function decodeHtml(html: string): string {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}