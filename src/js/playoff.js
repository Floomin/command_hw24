// // // playoff_script.js
document.addEventListener('DOMContentLoaded', function() {
    let countMatches = 1;
    let side = 1;
    let currentMatchIndex = 0;
    let currentStage = 0;
    const leaders = JSON.parse(localStorage.getItem('leaders')) || generateMockLeaders();
    const stages = ['1/8 Финала', '1/4 Финала', '1/2 Финала', 'Финал'];
    const matchesContainer = document.querySelectorAll('.playoff__round .playoff__groups, .playoff__round--semi-final .playoff__groups, .playoff__round--semi-final-final .playoff__group');
    const nextStageLeaders = [];
    const nextStageLeadersFull = [];

    function generateMockLeaders() {
        return [{
                flag: '🇳🇱',
                name: 'Нидерланды'
            },
            {
                flag: '🇺🇸',
                name: 'США'
            },
            {
                flag: '🇦🇷',
                name: 'Аргентина'
            },
            {
                flag: '🇦🇺',
                name: 'Австралия'
            },
            {
                flag: '🇯🇵',
                name: 'Япония'
            },
            {
                flag: '🇭🇷',
                name: 'Хорватия'
            },
            {
                flag: '🇧🇷',
                name: 'Бразилия'
            },
            {
                flag: '🇰🇷',
                name: 'Корея'
            },
            {
                flag: '🇬🇧',
                name: 'Англия'
            },
            {
                flag: '🇸🇳',
                name: 'Сенегал'
            },
            {
                flag: '🇫🇷',
                name: 'Франция'
            },
            {
                flag: '🇵🇱',
                name: 'Польша'
            },
            {
                flag: '🇲🇦',
                name: 'Марокко'
            },
            {
                flag: '🇪🇸',
                name: 'Испания'
            },
            {
                flag: '🇵🇹',
                name: 'Португалия'
            },
            {
                flag: '🇨🇭',
                name: 'Швейцария'
            },
        ];
    }

    function createMatchElement(team1, team2) {
        const matchElement = document.createElement('div');
        matchElement.className = 'match';
        matchElement.innerHTML = `
        <div class="team">
        ${team1.flag}
        <p>${team1.name}</p>
        <p>${team1.goals || ''}</p>
      </div>
      <div class="team">
        ${team2.flag}
        <p>${team2.name}</p>
        <p>${team2.goals || ''}</p>
      </div>
      `;
      return matchElement;
    }

    function createMatches(teams) {
        const matches = [];
        for (let i = 0; i < teams.length; i += 2) {
            matches.push([teams[i], teams[i + 1]]);
        }
        return matches;
    }

    function setupInitialStage() {
        const roundMatchesLeft = createMatches(leaders.slice(0, 8));
        const roundMatchesRight = createMatches(leaders.slice(8, 16));
        const roundContainerLeft = matchesContainer[0];
        const roundContainerRight = matchesContainer[5];

        roundMatchesLeft.forEach(match => {
            const [team1, team2] = match;
            const groupElement = document.createElement('div');
            groupElement.className = 'group';
            const matchElement = createMatchElement(team1, team2);
            groupElement.appendChild(matchElement);
            roundContainerLeft.appendChild(groupElement);
        });

        roundMatchesRight.forEach(match => {
            const [team1, team2] = match;
            const groupElement = document.createElement('div');
            groupElement.className = 'group';
            const matchElement = createMatchElement(team1, team2);
            groupElement.appendChild(matchElement);
            roundContainerRight.appendChild(groupElement);
        });
    }
})