
const root = document.documentElement;
const color = getComputedStyle(root).getPropertyValue('--accent-yellow').trim();

background_hex_color(color)

const term = new Terminal(
{
    theme:
    {
        foreground: '#C0C0C0',  // Off-white text color
        background: '#000000'   // Black background
    },

    fontFamily: 'Consolas',
    fontSize: "16px",
    letterSpacing: 0,           // try tweaking this
    lineHeight: 1.0,            // try increasing if "g" gets cut off
    rendererType: 'canvas',     // or 'webgl' if available
});

const terminal = document.querySelector(".terminal")
term.open(terminal);

const textarea = terminal.querySelector("textarea");
let terminal_focus;

if(textarea)
{
    textarea.addEventListener("focus", () =>
    {
        document.removeEventListener("wheel", scroll_zoom, { passive: false });
        terminal_focus = true;
        
        if(hint.style.opacity !== 0)
        {
            hint.style.animation = "none"; //Stop Animation
            void hint.offsetHeight; //Force Reflow
            hint.style.opacity = 0;
        }
    });

    textarea.addEventListener("blur", () =>
    {
        document.addEventListener("wheel", scroll_zoom, { passive: false });
        terminal_focus = false;
    });
}

terminal.addEventListener("wheel", (event) =>
{
    if(!terminal_focus) event.preventDefault();
}, 
{
    passive: false
});

//Declare Variables
let user_input = "";
let is_prompting = false; // Prevent double input

const start_prompt = 'Type "help" for commands\r\n\r\n'
const command_prompt = "C:\\Users\\mathisjean> "

let function_type = "linear";
let function_equation = `y = x`;

let m = "m";
let b = "b";
let a = "a";
let h = "h";
let k = "k";
let B = "B";
let r = "r";

//Graph Data
let baseEquation;
let domain;
let image;
let zeroTheFunction;

term.write(start_prompt + command_prompt);

// Handle keyboard input
term.onKey(({ key, domEvent }) =>
{
    if(is_prompting) return; // Ignore key presses during prompts

    if(key === '\r')
    {
        term.write('\r\n');
        if (user_input.trim() !== "") handleCompleteInput(user_input.trim());
        user_input = ""; // reset input

        if(!is_prompting)
        {
            term.write(command_prompt);
        }
    }
    else if(domEvent.key === "Backspace")
    {
        if (user_input.length > 0)
        {
            user_input = user_input.slice(0, -1);
            term.write('\b \b');
        }
    }
    else
    {
        user_input += key;
        term.write(key);
    }
});

//Handle a complete user command
async function handleCompleteInput(input)
{
    const cmd = input.toLowerCase();

    if (cmd === "help")
    {
        term.write(
            `\r\nAvailable commands:` +
            `\r\n A:           Set the value for 'a' slope or vertical stretch.` +
            `\r\n B:           Set the value for 'B' exponential base or 'b' linear y-intercept.` +
            `\r\n CLS:         Clears the terminal screen.` +
            `\r\n DESCRIPTION: Displays information about the graphing calculator program.` +
            `\r\n FUNCTION:    Choose and set a function.` +
            `\r\n GRAPH:       Displays the graph of the current function.` +
            `\r\n H:           Set the value for 'h' horizontal shift.` +
            `\r\n HELP:        Shows this list of available commands.` +
            `\r\n K:           Set the value for 'k' vertical shift.` +
            `\r\n M:           Set the value for 'm' slope for linear function.` +
            `\r\n R:           Set the value for 'r' radius for circles.` +
            `\r\n RESET:       Resets all function variables to default values.` +
            `\r\n STATISTICS:  Displays the equation, domain, image, and zeros of the function.` +
            `\r\n\r\n`
        );
    }
    else if (cmd === "cls")
    {
        term.clear();
        term.write(start_prompt);
    }
    else if (cmd === "reset")
    {
        term.write(`\r\nVariables have been reset.\r\n\r\n`);

        function_type = "linear";
        function_equation = "y = x";

        m = "m";
        b = "b";
        a = "a";
        h = "h";
        k = "k";
        B = "B";
        r = "r";
    }
    else if (cmd === "description")
    {
        term.write(`\r\nThis is a terminal-based graphing calculator.\r\nUse commands to define variables, select function types, \r\nand visualize graphs—all within the terminal interface.\r\n\r\n${command_prompt}`);
    }
    else if (cmd === "function")
    {
        change_function()
    }
    else if (["a", "b", "m", "h", "k", "b", "r", "B"].includes(cmd))
    {
        let value = (await promptUser(`Select a value for '${cmd}':`)).trim();

        if(isNaN(Number(value)))
        {
            term.write(`\r\n'${value}' is not a number, it has been set to 1 \r\n\r\n${command_prompt}`);
            value = "1";

            //Dynamically set the variable
            switch (cmd)
            {
                case "a": a = value; break;
                case "b": b = value; break;
                case "m": m = value; break;
                case "h": h = value; break;
                case "k": k = value; break;
                case "B": B = value; break;
                case "r": r = value; break;
            }

            return
        }

        //Dynamically set the variable
        switch(cmd)
        {
            case "a": a = value; break;
            case "b": b = value; break;
            case "m": m = value; break;
            case "h": h = value; break;
            case "k": k = value; break;
            case "B": B = value; break;
            case "r": r = value; break;
        }

        term.write(`\r\n'${cmd}' has been set to ${value} \r\n\r\n${command_prompt}`);
    }
    else if (cmd === "graph")
    {
        graph_function()
    }
    else if (cmd === "statistics")
    {
        functionUsed()

        term.write(`\r\nBase function: ${baseEquation}\r\nFunction: ${function_equation}\r\nDomain: ${domain}\r\nImage: ${image}\r\nZero of the function: ${zeroTheFunction}\r\n`)
        
        if(function_type === "absolute" || function_type === "quadratic" || function_type === "circle") term.write(`Axis of symmetry equation: x = ${h} \r\n`);
        else if(function_type === "exponential") term.write(`Asymptote Equations: y = ${k} \r\n`);

        term.write("\r\n")
    }
    else
    {
        term.write(`\r\n'${input}' is not recognized as an internal or external command\r\n\r\n`);
    }
}

async function promptUser(question)
{
    return new Promise(resolve =>
    {
        is_prompting = true;
        let answer = "";

        term.write(`\r\n${question} \r\n\r\n> `);

        const disposable = term.onKey(({ key, domEvent }) => 
        {
            if(key === '\r')
            {
                term.write('\r\n');
                disposable.dispose();
                is_prompting = false;
                resolve(answer.trim());
            } 
            else if(domEvent.key === "Backspace")
            {
                if(answer.length > 0)
                {
                    answer = answer.slice(0, -1);
                    term.write('\b \b');
                }
            }
            else
            {
                answer += key;
                term.write(key);
            }
        });
    });
}

async function change_function()
{
    function_type = (await promptUser("Select a function: linear, absolute, exponential, quadratic, circle")).toLowerCase().trim();

    switch(function_type) 
    {
        case "linear":
            function_equation = `y = (${m})x + (${b})`
            break;            

        case "absolute":
            function_equation = `y = ${a}|x - (${h})| + (${k})`;
            break;

        case "exponential":
            var superScriptMap = 
            [
                '0', '⁰', '1', '¹', '2', '²', '3', '³', '4', '⁴', '5', '⁵', '6', '⁶', '7', '⁷', '8', '⁸', '9', '⁹', 'h', 'ʰ'
            ];

            var arrayH = [];
            var power = "ˣ⁻";

            for (let q = 0; q < String(h).length; q++)
            {
                arrayH[q] = String(h).slice(q, q + 1);
                
                let indexH = superScriptMap.indexOf(String(arrayH[q])) + 1;

                power += "⁽h⁾";
                power = power.replace(/h/g, superScriptMap[indexH]);
            };    

            function_equation = `y = ${a}(${B})${power} + (${k})` ;     
            break;

        case "quadratic":
            function_equation = `y = ${a}(x - (${h}))² + (${k})`;
            break;

        case "circle":
            function_equation = `(x - (${h}))² + (y - (${k}))² = (${r})²`;
            break;            

        case "hihihaha":
            function_equation = "HiHiHaHa"
            break;            

        default:
            term.write(`\r\n'${function_type}' is not a valid function. \r\n`)

            function_type = "linear"

            function_equation = `y = (${m})x + (${b})`
            break;   
    };

    term.write(`\r\nFunction has been set to: ${function_equation} \r\n\r\n${command_prompt}`);
}

function graph_function()
{        
    let axisX = [];

    let graph = [];
    let graphDimension = 19;

    setupGraph();

    //Setup the function
    for(var x = -graphDimension; x <= graphDimension; x++) 
    {
        var y;
        var Y;
        var X = graphDimension + x;

        if(function_type == "circle")
        {
            if(isNaN(Number(r))) r = 5;
            if(isNaN(Number(h))) h = 0;
            if(isNaN(Number(k))) k = 0;

            for (let x = -graphDimension; x <= graphDimension; x++)
            {
                for (let y = -graphDimension; y <= graphDimension; y++)
                {
                    const dx = x - Number(h);
                    const dy = y - Number(k);
                    const distanceSquared = dx * dx + dy * dy;
                    const radiusSquared = Number(r) * Number(r);

                    // Allow a small tolerance due to integer rounding
                    if (Math.abs(distanceSquared - radiusSquared) <= 3)
                    {
                        const gx = x + graphDimension;
                        const gy = graphDimension - y;

                        if (gx >= 0 && gx <= graphDimension * 2 && gy >= 0 && gy <= graphDimension * 2)
                        {
                            graph[gy][gx] = "•"; // Use a better dot
                        }
                    }
                }
            }

            // Mark center
            const centerX = Math.round(Number(h) + graphDimension);
            const centerY = Math.round(graphDimension - Number(k));

            if (centerX >= 0 && centerX <= graphDimension * 2 && centerY >= 0 && centerY <= graphDimension * 2)
            {
                graph[centerY][centerX] = "○";
            }
        }

        else if(function_type == "linear")
        {
            if(isNaN(Number(m))) m = 1;
            if(isNaN(Number(b))) b = 0;

            y = Number(m) * x + Number(b);
        }
        else if(function_type == "absolute")
        {
            if(isNaN(Number(a))) a = 1;
            if(isNaN(Number(h))) h = 0;
            if(isNaN(Number(k))) k = 0;

            y = Math.abs(Number(a) * (x - Number(h))) + Number(k);
        }
        else if(function_type == "quadratic")
        {
            if(isNaN(Number(a))) a = 1;
            if(isNaN(Number(h))) h = 0;
            if(isNaN(Number(k))) k = 0;

            y = Number(a) * Math.pow(x - Number(h), 2) + Number(k);
        }
        else if(function_type == "exponential")
        {
            if(isNaN(Number(a))) a = 1;
            if(isNaN(Number(B))) B = 2;
            if(isNaN(Number(k))) k = 0;

            y = Number(a) * Math.pow(Number(B), x) + Number(k);
        }
        if(function_type === "hihihaha")
        {
            //Arrays that determine the position of the king
            let arrayX = 
            [
                -2, 2,-2, 2,-2,-1, 0, 2, 1, 2, 2,-3, 3,-3, 3,-4, 4,-4, 4,-5, 5,-3, 3,-2, 2,-1, 1, 0,-4, 4, 0, 0,-1, 1, 1,-1,-2,-1, 0, 1, 2,-2, 2,-2, 3,-3, 3,-3, 2,-2, 0, 0,-1, 1, 2,-2
            ]; 

            let arrayY = 
            [ 
                5, 5, 6, 6, 6, 6, 7, 6, 7, 7, 7, 4, 4, 3, 3, 2, 2, 0, 0, 1, 1,-2,-2,-3,-3,-4,-4,-5,-1,-1, 3, 2, 2, 2, 5, 5,10, 9, 9, 9,10,11,11,12,12,13,13,14,13,14,14,13,13,12,14,15
            ];

            let arraymX = 
            [
                -2, 2,-3, 3, 3,-3, 3,-3, 3,-3, 2,-2, 1,-1, 0,-1, 1,-2, 2
            ];

            let arraymY = 
            [
                    2, 2, 2, 2, 1, 1, 0, 0,-1,-1,-2,-2,-3,-3,-3, 4, 4, 4, 4
            ];

            //Print the king to the graph
            for(let q = 0; q < arrayY.length; q++)
            {
                X = graphDimension + arrayX[q];
                Y = graphDimension - arrayY[q];                  

                graph[Math.round(Y)][Math.round(X)] = "■";
            };
                
            for(let q = 0; q < arraymY.length; q++)
            {
                mX = graphDimension + arraymX[q];
                mY = graphDimension - arraymY[q];                  

                graph[Math.round(mY)][Math.round(mX)] = "o";
            };
        }
        else if(function_type != "circle" && y !== undefined)
        {
            Y = graphDimension - y;

            if(Y >= 0 && Y <= graphDimension * 2 && X >= 0 && X <= graphDimension * 2) 
            {
                graph[Math.round(Y)][Math.round(X)] = "•"; 
            };        
        };        
    };

    //Print the graph to the console
    printGraph();

    function setupGraph()
    {
        //Sets up graph spacing as well as x and y axis and y axis coordinates

        for(let q = 0; q <= (graphDimension * 2); q ++)
        {
            let graphX = [];

            if (q == graphDimension)
            {
                graph[q] = axisX;        
            }
        
            else if (q < graphDimension || q >= graphDimension)
            {
                graph[q] = graphX;
            };

            for (let p = 0; p < graphDimension; p++)
            {
                graphX[p] = " ";
                axisX[p] = "─";
            };
            
            graphX[graphDimension] = "│";
            axisX[graphDimension] = "┼";
            
            for (let p = graphDimension + 1; p < graphDimension * 2 + 1; p++)
            {
                graphX[p] = " ";
                axisX[p] = "─";
            };
        };
    };

    function printGraph()
    {
        //Prints the graph to the console after the function has been added, aligns the x coordinates and prints them to the console
        for(let q = 0; q <= (graphDimension * 2); q ++)
        {
            if(q == graphDimension)
            {
                term.write(graph[q].join("─") + "\r\n"); 
            }
            else
            {
                term.write(graph[q].join(" ") + "\r\n");           
            }
        };  

        term.write("\r\n")
    };
}

function functionUsed()
{
    if(isNaN(Number(m))) m = 1;
    if(isNaN(Number(b))) b = 0; 
    if(isNaN(Number(a))) a = 1;
    if(isNaN(Number(h))) h = 0;
    if(isNaN(Number(k))) k = 0;
    if(isNaN(Number(B))) B = 2;
    if(isNaN(Number(r))) r = 5;

    //Determines which function is being used and sets values such as the equation and the zeros of the function for the specific function

    switch(function_type)
    {
        case "linear":
            //Base equation
            baseEquation = "y = mx + b";      

            //Domain
            domain = "] -∞ , ∞ [";

            //Image
            image = "] -∞ , ∞ [";

            //Zero of the function
            try 
            {
                if (m === 0 && b === 0) 
                {
                    throw new Error("Division by zero error.");
                }

                else if (m === 0 && b !== 0)
                {
                    zeroTheFunction = "None";
                }    

                else
                {
                    zeroTheFunction = (-1 * Number(b) / Number(m)).toFixed(2);
                };
            }
            catch (Error) 
            {
                zeroTheFunction = "∞";
            };

            break;

        case "absolute":
            //Base equation
            baseEquation = "y = a|x - h| + k";

            //Domain
            domain = "] -∞ , ∞ [";

            //Image
            if ((a / Math.abs(a)) == 1)
            {
                image = "[ " + k + " , ∞ [";
            }
            else
            {
                image = "] -∞ , " + k + " ]";
            };

            //Zero of the function
            try 
            {
                if (a === 0 && k === 0) 
                {
                    throw new Error("a is zero, division by zero error.");
                }

                else if (a === 0 && k !== 0)
                {
                    zeroTheFunction = "None";
                }

                let zero1 = ((-k / a) + h).toFixed(2);
                let zero2 = (-(-k / a) + h).toFixed(2);

                if ((a * Math.abs(zero1 - h)) + k !== 0 && (a * Math.abs(zero2 - h)) + k !== 0)
                {
                    zeroTheFunction = "None";
                }
                else if (zero1 != zero2)
                {
                    zeroTheFunction = String(zero1) + ", " + String(zero2);
                }
                else if (zero1 == zero2)
                {
                    zeroTheFunction = String(zero1);
                };
            }
            catch (error) 
            {
                zeroTheFunction = "∞";
            };

            break;

        case "exponential":
            //Base equation
            baseEquation = "y = aBˣ⁻ʰ + k";    

            //Domain
            domain = "] -∞ , ∞ [";

            //Image
            image = "] -∞ , ∞ [";

            //Zero of the function
            try 
            {
                if (a === 0 && k === 0) 
                {
                    throw new Error("Division by zero error.");
                }

                else if (a === 0 && k !== 0)
                {
                    zeroTheFunction = "None";
                };

                let zero = h + Math.log(0 - k / a) / Math.log(B);

                if (isNaN(zero) || !isFinite(zero))
                {
                    zeroTheFunction = "None";
                }
                else
                {
                    zeroTheFunction = String(zero.toFixed(2));
                };                   
            }
            catch (error) 
            {
                zeroTheFunction = "∞";
            };

            break;

        case "quadratic":
            //Base equation
            baseEquation = "y = a(x - h)² + k";

            //Domain
            domain = "] -∞ , ∞ [";

            //Image
            if ((a / Math.abs(a)) == 1)
            {
                image = "[ " + k + " , ∞ [";
            }
            else
            {
                image = "] -∞ , " + k + " ]";
            };

            //Zero of the function
            try 
            {
                let zero1 = -Math.sqrt(-k / a) + h;
                let zero2 = Math.sqrt(-k / a) + h;

                if (a === 0 && k === 0) 
                {
                    throw new Error("Division by zero error.");
                }

                else if (a === 0 && k !== 0)
                {
                    zeroTheFunction = "None";
                };

                if (isNaN(zero1) && isNaN(zero2))
                {
                    zeroTheFunction = "None";
                }
                else if (zero1 != zero2)
                {
                    zeroTheFunction = String(zero1.toFixed(2)) + ", " + String(zero2.toFixed(2));
                }
                else if (zero1 == zero2)
                {
                    zeroTheFunction = String(zero1.toFixed(2));
                };
            }
            catch (error) 
            {
                zeroTheFunction = "∞";
            };

            break;

        case "circle":
            //Base equation
            baseEquation = "(x - h)² + (y - k)² = r²";

            //Domain
            domain = "[" + String(h - r) + " , " + String(h + r) + "]";

            //Image
            image = "[" + String(k - r) + " , " + String(k + r) + "]";

            //Zero of the function
            let zero1 = h + Math.sqrt(r*r - Math.pow((- k), 2));
            let zero2 = h - Math.sqrt(r*r - Math.pow((- k), 2));

            if (zero1 != zero2)
            {
                zeroTheFunction = String(zero1.toFixed(2)) + ", " + String(zero2.toFixed(2));
            }
            else if (zero1 == zero2)
            {
                zeroTheFunction = String(zero1.toFixed(2));
            };

            break;

        default:
            baseEquation = "HiHiHaHa";
            domain = "HiHiHaHa";
            image = "HiHiHaHa";
            zeroTheFunction = "HiHiHaHa";
            break;
    };
};