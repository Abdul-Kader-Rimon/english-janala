const createElements = (arr) => {
    const htmlElements = arr.map((el) => `<span class="btn">${el}</span>`);
     return htmlElements.join(" "); 
}
function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-EN"; // English
    window.speechSynthesis.speak(utterance);
}

// spinner

const manageSpinner = (status) => {

    if (status == true) {
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("word-container").classList.add("hidden");
    } else {
        document.getElementById("word-container").classList.remove("hidden");
        document.getElementById("spinner").classList.add("hidden");
    }
    
}
const loadLesson = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")

        .then(res => res.json())
        .then(json => displayLesson(json.data))
};

// active btn remove

const removeActive = () => {
    const lessonButton = document.querySelectorAll(".lesson-btn")
    lessonButton.forEach((btn) => btn.classList.remove("active"));    
}

const loadLevelword = (id) => {
    manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            
            removeActive(); // remove active class
            const clickBtn = document.getElementById(`lesson-btn-${id}`)
            clickBtn.classList.add("active"); //add active class
            displayLevelword(data.data)
        });
};



const loadwordDetail = async(id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const res = await fetch(url);
    const details = await res.json();
    displayWordDetails(details.data)
}
const displayWordDetails = (word) => {
    const detailsBox = document.getElementById("details-container")

    detailsBox.innerHTML = `
      <div class="">
                        <h2 class="text-2xl font-bold">${word.word} (<i class="fa-solid fa-microphone-lines"></i>: ${word.pronunciation})</h2>
                    </div>
                    <div class="">
                        <h2 class="font-bold">Meaning</h2>
                        <p>${word.meaning}</p>
                    </div>
                    <div class="">
                        <h2 class="font-bold">Example</h2>
                        <p>${word.sentence}</p>
                    </div>
                    <div class="">
                        <h2 class="font-bold">সমার্থক শব্দ গুলো</h2>
                          <div class=""> ${createElements(word.synonyms)}</div>
                    </div>
    `

    document.getElementById("word_modal").showModal()
}

const displayLevelword = (words) => {
    //1. get the container and empty

    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";

    if (words.length == 0) {
        wordContainer.innerHTML = `
        
         <div class="text-center col-span-full rounded-lg py-10 space-y-6 font-bangla">

                <img class="mx-auto" src="./assets/alert-error.png"/>
                <p class="text-xl font-medium text-gray-400">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <h2 class="font-bold text-4xl">নেক্সট Lesson এ যান</h2>
            </div>
        `;
        manageSpinner(false);
        return;
    }

    //2 . get into every words
    words.forEach(word => {

        // console.log(word)
        // 3. create element
        const card = document.createElement("div");
        card.innerHTML = `
                <div class="bg-white rounded-lg text-center shadow-sm py-10 px-5 space-y-4">
                    <h1 class="font-bold text-2xl">${word.word ? word.word : "এখন এ শব্দ  পাওয়া যায়নি "}</h1>
                    <p class="font-semibold">Meaning/Pronunciation</p>
                    <div class="text-2xl font-medium font-bangla">${word.meaning ? word.meaning : "অর্থ  পাওয়া যায়নি  "} / ${word.pronunciation ? word.pronunciation : "pronunciation পাওয়া যায়নি"}</div>
                    <div class="flex justify-between items-center">
                    <button onclick="loadwordDetail(${word.id})" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-circle-info"></i></button>
                    <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-volume-high"></i></button>
                </div>

            </div>
        `

        // 4.append into container

        wordContainer.append(card)

    });
    manageSpinner(false);
};

const displayLesson = (lessons) => {
    // 1. get the container and empty

    const levelContainer = document.getElementById("level-container");
    levelContainer.innerHTML = "";

    // 2. get into every lessons

    for (let lesson of lessons) {
        // 3. create element

        const btnDiv = document.createElement("div");
        btnDiv.innerHTML = `
        <button id="lesson-btn-${lesson.level_no}" onclick ="loadLevelword(${lesson.level_no})"  class="btn btn-outline btn-primary lesson-btn" ><i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}</button>
        `

        // 4.append into container

        levelContainer.append(btnDiv)

    }

};
loadLesson()

document.getElementById("btn-search").addEventListener("click", () => {
    removeActive();
    const input = document.getElementById("input-search");
    const searchValue = input.value.trim().toLowerCase();
    console.log(searchValue);

    fetch("https://openapi.programming-hero.com/api/words/all")
        .then((res) => res.json())
        .then((data) => {
            const allWords = data.data;
            console.log(allWords);
            const filterWords = allWords.filter((word) => word.word.toLowerCase().includes(searchValue));

            displayLevelword(filterWords)
        })
})