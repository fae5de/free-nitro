// Prompt user for configuration input
const userCodesToGenerate = prompt('Wie viel Nitro brauchst du?:', '5');
const userDelay = prompt('Gebe ein Delay ein, sodass Ratelimits vermeidet werden:', '1000');

const CodesToGenerate = parseInt(userCodesToGenerate) || 5;
const Delay = parseInt(userDelay) || 1000;

async function generatePromoCodeLinks() {
    const SAVED_UUID = 'systemData';
    const DISCORD_BASE_URL = 'https://discord.com/billing/partner-promotions';
    const DISCORD_API_URL = 'https://api.discord.gx.games/v1/direct-fulfillment';
    const PROMOTION_ID = '1180231712274387115';

    const generateUUID = () =>
        'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (Math.random() * 16) | 0;
            return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
        });

    const initRequestToDiscord = async (uuid) => {
        const requestData = { partnerUserId: uuid };

        try {
            const response = await fetch(DISCORD_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    const generateAndShowPromoUrl = async () => {
        const uuid = generateUUID();
        localStorage.setItem(SAVED_UUID, uuid);
        const response = await initRequestToDiscord(uuid);
        return `${DISCORD_BASE_URL}/${PROMOTION_ID}/${response.token}`;
    };

    const generateMultiplePromoUrls = async () => {
        const promoLinks = [];
        for (let i = 0; i < CodesToGenerate; i++) {
            const link = await generateAndShowPromoUrl();
            promoLinks.push(link);
            console.log(link);
            await new Promise((resolve) => setTimeout(resolve, Delay));
        }
        return promoLinks;
    };

    return generateMultiplePromoUrls();
}

async function displayPromoCodeLinks() {
		alert('Deine Links werden generiert. Du musst ungefähr: ' + (CodesToGenerate * Delay) / 1000 + ' Sekunden warten');
    try {
				document.body.innerHTML = '';
        const estimatedTime = document.createElement('p');
        estimatedTime.textContent = 'Zeit die du warten musstest/abwarten musst: ' + (CodesToGenerate * Delay) / 1000 + ' Seconds';
        document.body.appendChild(estimatedTime);

        const links = await generatePromoCodeLinks();
        const linksList = document.createElement('ul');
        linksList.style.textAlign = 'center';

        links.forEach((link) => {
            const listItem = document.createElement('li');
            const linkElement = document.createElement('a');
            linkElement.href = link;
            linkElement.target = '_blank';
            linkElement.textContent = link;
            listItem.appendChild(linkElement);
            linksList.appendChild(listItem);
        });
				alert('Yay! Viel Spaß mit Nitro! Noch Fragen? Wende dich an: email@fae5.de)')

        document.body.innerHTML = '';

        const title = document.createElement('h2');
        title.textContent = 'Generated Nitro\'s:';
        title.style.textAlign = 'center';
        document.body.appendChild(title);

        document.body.appendChild(linksList);

        document.body.appendChild(estimatedTime);

        const copyButton = document.createElement('button');
        copyButton.textContent = 'Alles kopieren';
        copyButton.style.position = 'absolute';
        copyButton.style.top = '10px';
        copyButton.style.right = '10px';
        copyButton.addEventListener('click', () => {
            copyToClipboard(links);
            alert('Kopiert!');
        });
        document.body.appendChild(copyButton);
    } catch (error) {
        console.error('FEHLER:', error);
    }
}

function copyToClipboard(links) {
    const textToCopy = links.join('\n');
    const textarea = document.createElement('textarea');
    textarea.value = textToCopy;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

console.log('Deine Nitros werden generiert. Du musst wahrscheinlich: ' + (CodesToGenerate * Delay) / 1000 + ' Sekunden warten');
displayPromoCodeLinks();
