// this is a mess that was adjusted until the outcome looked right.
// don't expect anything coherent.
// appologies to myself when I have to update something

function drawSymbol(canvas, symbol, x, y, scale, spacing, thickness, accentHeight, color)
{
    if(symbol == ' ')
        return;
    
    const parseRegex = /(\!?)([a-z]*)\,([a-z]*)/;
    let parse = symbol.match(parseRegex);
    let accent = parse[1] != '';
    let consonants = parse[2];
    let vowels = parse[3];
    let conFullHeight = (vowels == '');
    let vwlFullHeight = (consonants == '');

    if(accent)
    {
        let path = letter["!"];
        canvas.path(path).fill('none').move(x+(scale-1)*3-spacing*scale,y+scale*2).scale(scale,scale*accentHeight/6).stroke({color:color, width:thickness/scale/2, linecap:"round"});
    }

    if(consonants != '')
    {
        let ligatures = [];
        let i = 0;
        while(i < consonants.length)
        {
            let ligature = consonants[i];
            while(i < consonants.length)
            {
                let nextLetter = consonants[++i];
                if(letter[ligature+nextLetter])
                {
                    ligature += nextLetter;
                }
                else
                {
                    i--;
                    break;
                }
            }
            ligatures.push(ligature);
            i++
        }

        let ligatureWidth = (1-spacing)/ligatures.length;
        let yDiv = conFullHeight ? 1 : 2;
        let yAdj = conFullHeight ? 0 : -scale;
        for(let i = 0; i < ligatures.length; i++)
        {
            let path = letter[ligatures[i]];

            let xScale = scale*ligatureWidth;
            let yScale = scale/yDiv;
            let thicknessAdjustment = Math.sqrt(xScale**2 + yScale**2)/**ligatureWidth*2*/;
            canvas.path(path).fill('none').move(x+(scale-1)*3 + (scale*6*ligatureWidth*i) - ((ligatures.length-1) * scale/2),y+scale*2+accentHeight*scale+yAdj).scale(xScale,yScale).stroke({color:color, width:thickness/thicknessAdjustment});
        }
    }

    
    if(vowels != '')
    {
        let ligatures = [];
        let i = 0;
        while(i < vowels.length)
        {
            let ligature = vowels[i];
            while(i < vowels.length)
            {
                let nextLetter = vowels[++i];
                if(letter[ligature+nextLetter])
                {
                    ligature += nextLetter;
                }
                else
                {
                    i--;
                    break;
                }
            }
            ligatures.push(ligature);
            i++
        }

        let ligatureWidth = (1-spacing)/ligatures.length;
        let yDiv = vwlFullHeight ? 1 : 2;
        let yAdj = vwlFullHeight ? 0 : scale*2.5;
        for(let i = 0; i < ligatures.length; i++)
        {
            let path = letter[ligatures[i]];

            let xScale = scale*ligatureWidth;
            let yScale = scale/yDiv;
            let thicknessAdjustment = Math.sqrt(xScale**2 + yScale**2)/**ligatureWidth*2*/;
            canvas.path(path).fill('none').move(x+(scale-1)*3 + (scale*5*ligatureWidth*i) - ((ligatures.length-1) * scale/2),y+scale*2+accentHeight*scale+yAdj).scale(xScale,yScale).stroke({color:color, width:thickness/thicknessAdjustment});
        }
    }
}

function drawString(string, scale, thickness, accentHeight, spacing, padding, color)
{
    scale = (scale == undefined) ? 1 : scale;
    thickness = (thickness == undefined) ? scale/16 : thickness;
    accentHeight = (accentHeight == undefined) ? 4 : accentHeight;
    spacing = (spacing == undefined) ? scale/32 : spacing;
    padding = (padding == undefined) ? thickness : padding;
    color = (color == undefined) ? "#000" : color;

    strArray = string.split("|");

    let charWidth = scale*6;
    let charHeight = scale*7;

    let imageWidth = ((charWidth+spacing) * strArray.length) - spacing + (2 * padding);
    let imageHeight = charHeight + (accentHeight*scale) + (2 * padding);

    let canvas = SVG().size(imageWidth, imageHeight);

    
    for(let i = 0; i < strArray.length; i++)
    {
        drawSymbol(canvas, strArray[i], padding + (charWidth+spacing)*i, padding, scale, spacing, thickness, accentHeight, color);
    }

    return canvas;
}

function update()
{
    document.getElementById("output-box").innerHTML="";
    let string = document.getElementById("text-input").value;
    drawString(string, 5, 2).addTo("#output-box");
}

function main()
{
    update();
}