const soundToggle = document.getElementById('soundToggle');
const bgMusic = document.getElementById('bgMusic');
const selectSound = document.getElementById('selectSound');
const container = document.getElementById('container');
const characters = document.querySelectorAll('.character');

let isPlaying = false;
let selectedCharacter = ''; // 선택한 캐릭터를 저장할 변수
let characterElement; // 캐릭터 이미지 요소
let currentDirection = ''; // 현재 방향
let hasItem = false; // 아이템을 가지고 있는지 여부
let monsterElement; // 몬스터 이미지 요소

soundToggle.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        soundToggle.textContent = 'Music On';
    } else {
        bgMusic.play();
        soundToggle.textContent = 'Music Off';
    }
    isPlaying = !isPlaying;
});

characters.forEach(character => {
    character.addEventListener('click', () => {
        selectSound.currentTime = 0; // 사운드 재생 시 처음부터 시작
        selectSound.play();
        
        selectedCharacter = character.dataset.character; // 선택한 캐릭터 저장
        fadeOut();
    });
});

function fadeOut() {
    container.style.opacity = '0';
    setTimeout(() => {
        fadeIn(); 
    }, 500);
}

function fadeIn() {
    container.innerHTML = ''; // 내용 삭제 후 게임 화면 추가
    container.style.opacity = '1';

    // 중앙 메시지 생성
    const messageBox = document.createElement('div');
    messageBox.style.position = 'absolute';
    messageBox.style.left = '50%';
    messageBox.style.top = '20%';
    messageBox.style.transform = 'translate(-50%, -50%)';
    messageBox.style.color = 'white';
    messageBox.style.fontSize = '24px'; // 글자 크기
    messageBox.style.fontFamily = 'DOSGothic';
    messageBox.style.zIndex = 200; // 메시지가 캐릭터 위에 나타나도록 설정
    messageBox.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // 반투명 배경
    messageBox.style.padding = '20px'; // 패딩 추가
    messageBox.style.borderRadius = '10px'; // 모서리 둥글게
    messageBox.innerHTML = `
        ← → 방향키를 움직여 이동 <br>
        오른쪽에 있는 ㅇㅇ을 해치워 ㅇㅇ나아갑시다?
    `;
    container.appendChild(messageBox);

    // 캐릭터 이미지 추가
    characterElement = document.createElement('img');
    characterElement.src = `${selectedCharacter}.png`; // 선택한 캐릭터의 PNG 사용
    characterElement.style.position = 'absolute';
    characterElement.style.left = '50px';
    characterElement.style.bottom = '100px';
    characterElement.style.width = '150px'; // 캐릭터 크기 설정
    characterElement.style.height = 'auto'; // 비율 유지 (또는 원하는 값을 설정)
    characterElement.style.zIndex = 100;
    container.appendChild(characterElement);

    // 아이템 생성
    const itemElement = document.createElement('img');
    itemElement.src = 'item1.png'; // 아이템 이미지 추가 (PNG 형식)
    itemElement.style.position = 'absolute';
    itemElement.style.bottom = '100px';
    itemElement.style.left = 'calc(50% - 50px)'; // 가운데 위치
    itemElement.style.width = '150px'; // 아이템 크기 설정
    itemElement.style.height = 'auto'; // 비율 유지 (또는 원하는 값을 설정)

    container.appendChild(itemElement);

    // 몬스터 생성 (랜덤한 위치)
    createMonster();

    // 키보드 이벤트 리스너 추가
    window.addEventListener('keydown', moveCharacter);
    window.addEventListener('keyup', stopCharacter);

    // 아이템과의 충돌 체크
    const checkItemCollision = setInterval(() => {
        const characterRect = characterElement.getBoundingClientRect();
        const itemRect = itemElement.getBoundingClientRect();

        // 캐릭터와 아이템이 닿으면 아이템 반응
        if (
            characterRect.right > itemRect.left &&
            characterRect.left < itemRect.right &&
            characterRect.bottom > itemRect.top &&
            characterRect.top < itemRect.bottom
        ) {
            hasItem = true; // 아이템을 얻었음을 표시
            container.removeChild(itemElement); // 아이템 제거
            characterElement.src = `${selectedCharacter}-${currentDirection}-item.png`; // 아이템을 가진 캐릭터 이미지로 변경
            displayItemMessage(); // 아이템 메시지 표시
            clearInterval(checkItemCollision); // 충돌 체크 중지
            selectSound.play();
        }
    }, 100); // 100ms마다 충돌 체크

    // 몬스터와의 충돌 체크
    const checkMonsterCollision = setInterval(() => {
        const characterRect = characterElement.getBoundingClientRect();
        const monsterRect = monsterElement.getBoundingClientRect();

        // 캐릭터와 몬스터가 닿으면 화면을 검은색으로 변경
        if (
            characterRect.right > monsterRect.left &&
            characterRect.left < monsterRect.right &&
            characterRect.bottom > monsterRect.top &&
            characterRect.top < monsterRect.bottom
        ) {
            showChoices(); // 선택지 표시
            clearInterval(checkMonsterCollision); // 충돌 체크 중지
        }
    }, 100); // 100ms마다 충돌 체크
}

// 몬스터 생성 함수
function createMonster() {
    monsterElement = document.createElement('img');
    monsterElement.src = 'monster.png'; // 몬스터 이미지 추가 (PNG 형식)
    monsterElement.style.position = 'absolute';
    monsterElement.style.bottom = '100px';
    monsterElement.style.right = '50px'; // 바닥에 위치
    monsterElement.style.width = '150px'; // 몬스터 크기 설정
    monsterElement.style.height = 'auto'; // 비율 유지 (또는 원하는 값을 설정)
    container.appendChild(monsterElement);
}

// 선택지를 표시하는 함수
function showChoices() {
    container.innerHTML = ''; // 기존 요소 모두 제거

    const choiceBox = document.createElement('div');
    choiceBox.style.position = 'absolute';
    choiceBox.style.left = '50%';
    choiceBox.style.top = '50%';
    choiceBox.style.transform = 'translate(-50%, -50%)';
    choiceBox.style.zIndex = 300; // 버튼이 가장 위에 나타나도록 설정
    choiceBox.style.display = 'flex'; // 플렉스 박스 사용
    choiceBox.style.flexDirection = 'column'; // 세로 방향 정렬
    choiceBox.style.alignItems = 'center'; // 가운데 정렬

    const fightButton = document.createElement('button');
    fightButton.textContent = '';
    
    // 버튼 스타일 추가
    fightButton.style.marginBottom = '10px'; // 버튼 사이 간격
    fightButton.style.padding = '15px 30px'; // 패딩 설정
    fightButton.style.fontWeight = '600'; // 글자 굵게
    fightButton.style.border = 'none'; // 테두리 제거
    fightButton.style.overflow = 'hidden'; // 오버플로우 숨기기
    fightButton.style.transition = 'transform 0.3s'; // 호버 시 변환 효과
    
    // 마우스 올렸을 때 확대 효과
    fightButton.addEventListener('mouseover', () => {
        fightButton.style.transform = 'scale(1.1)'; // 확대
    });
    
    // 마우스 벗어났을 때 원래 크기로 복구
    fightButton.addEventListener('mouseout', () => {
        fightButton.style.transform = 'scale(1)'; // 원래 크기
    });
    
    // 안에 들어갈 span 요소 생성
    const fightButtonSpan = document.createElement('span');
    fightButtonSpan.textContent = '싸우기';
    fightButtonSpan.style.display = 'block'; // 블록 요소로 처리
    fightButtonSpan.style.borderRadius = '50px';
    fightButtonSpan.style.borderColor = 'black';
    fightButtonSpan.style.padding = '0 20px'; // 좌우 패딩
    fightButtonSpan.style.animation = 'move-left 2s linear infinite'; // 좌측으로 애니메이션
    
    // ::after 효과와 유사한 기능을 JS로 추가
    fightButtonSpan.setAttribute('data-text', '싸우기');
    
    // 스팬의 애프터 효과 구현
    fightButtonSpan.style.position = 'relative';
    const spanAfter = document.createElement('span');
    spanAfter.textContent = '싸우기';
    spanAfter.style.position = 'absolute';
    spanAfter.style.top = '0';
    spanAfter.style.left = '100%';
    spanAfter.style.display = 'flex';
    spanAfter.style.justifyContent = 'center';
    spanAfter.style.alignItems = 'center';
    spanAfter.style.width = '100%';
    spanAfter.style.height = '100%';
    spanAfter.style.whiteSpace = 'nowrap'; // 텍스트 줄바꿈 방지
    
    // fightButton에 스팬 추가
    fightButton.appendChild(fightButtonSpan);
    fightButtonSpan.appendChild(spanAfter);
    
    // 클릭 시 동작
    fightButton.onclick = () => {
        showBadEnding();
    };
    
    // 애니메이션 CSS 추가 (JS 내에서 스타일 적용)
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes move-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
        }
    `;
    document.head.appendChild(style);
    

    const fleeButton = document.createElement('button');
    fleeButton.textContent = '도망가기';
    fleeButton.style.marginTop = '10px';
    fleeButton.style.position = 'flex';
    fleeButton.onclick = () => {
        alert("도망쳤습니다!");
        location.reload(); // 새로고침
    };

    choiceBox.appendChild(fightButton);
    choiceBox.appendChild(fleeButton);
    container.appendChild(choiceBox);
}

// 나쁜 결말 메시지를 표시하는 함수
function showBadEnding() {
    container.innerHTML = ''; // 기존 요소 모두 제거

    const messageBox = document.createElement('div');
    messageBox.style.backgroundColor = 'white'; // 흰색 배경
    messageBox.style.color = 'black'; // 흰색 글씨
    messageBox.style.padding = '20px';
    messageBox.style.position = 'absolute';
    messageBox.style.left = '50%';
    messageBox.style.top = '50%';
    messageBox.style.transform = 'translate(-50%, -50%)';
    messageBox.style.borderRadius = '10px'; // 모서리 둥글게
    messageBox.style.zIndex = 400; // 메시지가 가장 위에 나타나도록 설정

    const heading = document.createElement('h3');
    heading.textContent = 'Bad ending';
    messageBox.appendChild(heading);

    const paragraph = document.createElement('p');
    paragraph.textContent = '아직 ' + selectedCharacter + '을(를) 물리치기엔 너무 약하다. 좀 더 강해져서 다시 오자.';
    messageBox.appendChild(paragraph);

    const retryButton = document.createElement('button');
    retryButton.textContent = '다시 하기';
    retryButton.onclick = () => {
        location.reload(); // 새로고침
    };

    messageBox.appendChild(retryButton);
    container.appendChild(messageBox);
}

function displayItemMessage() {
    const itemMessageBox = document.createElement('div');
    itemMessageBox.style.position = 'absolute';
    itemMessageBox.style.left = '50%';
    itemMessageBox.style.top = '50%';
    itemMessageBox.style.transform = 'translate(-50%, -50%)';
    itemMessageBox.style.color = 'white';
    itemMessageBox.style.fontSize = '24px'; // 글자 크기
    itemMessageBox.style.zIndex = 300; // 메시지가 가장 위에 나타나도록 설정
    itemMessageBox.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // 반투명 배경
    itemMessageBox.style.padding = '20px'; // 패딩 추가
    itemMessageBox.style.borderRadius = '10px'; // 모서리 둥글게
    itemMessageBox.innerHTML = `
        아이템을 얻었다! <br>
        <img src="item1.png" alt="아이템" style="width: 50px; height: auto;"> <br>
        파괴력 + 100 상승
    `;
    container.appendChild(itemMessageBox);

    // 3초 후 메시지 사라지기
    setTimeout(() => {
        container.removeChild(itemMessageBox);
    }, 3000);
}

function moveCharacter(event) {
    const leftPosition = parseInt(characterElement.style.left, 10) || 20; // 현재 위치
    const speed = 10; // 이동 속도 증가

    // 캐릭터의 너비를 고려하여 오른쪽 경계 설정
    const characterWidth = characterElement.offsetWidth;

    if (event.key === 'ArrowLeft') {
        currentDirection = 'left';
        characterElement.src = hasItem ? `${selectedCharacter}-left-item.png` : `${selectedCharacter}-left.png`; // 왼쪽 이동 PNG
        characterElement.style.left = `${Math.max(0, leftPosition - speed)}px`; // 왼쪽으로 이동 (0 이하로 가지 않도록 제한)
    } else if (event.key === 'ArrowRight') {
        currentDirection = 'right';
        characterElement.src = hasItem ? `${selectedCharacter}-right-item.png` : `${selectedCharacter}-right.png`; // 오른쪽 이동 PNG
        characterElement.style.left = `${Math.min(1500 - characterWidth, leftPosition + speed)}px`; // 오른쪽으로 이동 (1920px을 넘지 않도록 제한)
    }
}

function stopCharacter() {
    // 방향키를 놓으면 현재 방향의 정지 상태 PNG를 유지
    if (currentDirection === 'left') {
        characterElement.src = hasItem ? `${selectedCharacter}-left-item-stop.png` : `${selectedCharacter}-left-stop.png`; // 왼쪽 정지 상태 PNG
    } else if (currentDirection === 'right') {
        characterElement.src = hasItem ? `${selectedCharacter}-right-item-stop.png` : `${selectedCharacter}-right-stop.png`; // 오른쪽 정지 상태 PNG
    }
}