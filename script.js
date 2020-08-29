/**************************
******QUIZ CONTROLLER******
**************************/
var quizController = (function() {
   
   //************Question Constructor************
    function Question(id, questionText, options, correctAnswer) {
        this.id = id;
        this.questionText = questionText;
        this.options = options;
        this.correctAnswer = correctAnswer;
    }
    
    var questionLocalStorage = {
        setQuestionCollection: function(newCollection) {
            localStorage.setItem('questionCollection', JSON.stringify(newCollection));
        },
        getQuestionCollection: function() {
            return JSON.parse(localStorage.getItem('questionCollection'));
        },
        removeQuestionCollection: function() {
            localStorage.removeItem('questionCollection');
        }
    }
    
    if(questionLocalStorage.getQuestionCollection() === null) {
        questionLocalStorage.setQuestionCollection([]);
    } //prepare the local storage when the application starts
    
    return {
        
        getQuestionOnLocalStorage: questionLocalStorage, //make questionLocalStorge public
        
        addQuestionOnLocalStorage: function(newQuestText, opts) {
            //console.log('Hi');
            var optionsArr, corrAns, questionId, newQuestion, getStoredQuests, isChecked;
            
             if(questionLocalStorage.getQuestionCollection() === null) {
                questionLocalStorage.setQuestionCollection([]);
            }  // It prepares for us to local storage when it's empty.
            optionsArr = [];
            // questionId = 0;
            for(var i = 0; i < opts.length; i++) {
                if(opts[i].value !== "" ) {
                    optionsArr.push(opts[i].value);
                }
                if(opts[i].previousElementSibling.checked && opts[i].value !== "") {
                corrAns = opts[i].value;
                isChecked = true;
                }
            }
            
            if(questionLocalStorage.getQuestionCollection().length > 0) {
                questionId = questionLocalStorage.getQuestionCollection()[questionLocalStorage.getQuestionCollection().length - 1].id + 1;
            }else {
                questionId = 0;
            }
            
            if(newQuestText.value !== "") {
                if(optionsArr.length > 1){
                    if(isChecked) {
                        newQuestion = new Question(questionId, newQuestText.value, optionsArr, corrAns);
                        getStoredQuests = questionLocalStorage.getQuestionCollection();
                        getStoredQuests.push(newQuestion);
                        questionLocalStorage.setQuestionCollection(getStoredQuests);
                        newQuestText.value = "";  // make text area clear after insert!!
                        for(var x = 0; x < opts.length; x++) {
                            opts[x].value = "";  // make text area clear after insert!!
                            opts[x].previousElementSibling.checked = false;
                        }
                        console.log(questionLocalStorage.getQuestionCollection());
                        return true;
                    }else {
                        alert('You missed to check correct answer, or you checked answer without value');                
                        return false;
                    }
                }else {
                    alert('You must insert at least two options');
                    return false;
                }
            }else {
                alert('Please, Insert Question');
                return false;
            }
            
//            
//            
//            console.log(optionsArr);
//            console.log(corrAns);
//            console.log(newQuestion);
//            console.log(questionLocalStorage.getQuestionCollection());
        }
    };
    
})();

/**************************
*******UI CONTROLLER*******
**************************/
var UIController = (function() {
    
    var domItems = {
      //******Admin Panel Elements******
        questionInsertBtn: document.getElementById("question-insert-btn"),
        newQuestionText: document.getElementById('new-question-text'),
        adminOptions: document.querySelectorAll('.admin-option'),//?
        adminOptionsContainer: document.querySelector(".admin-options-container"),
        insertedQuestsWrapper: document.querySelector(".inserted-questions-wrapper"),
        questUpdateBtn: document.getElementById('question-update-btn'),
        questDeleteBtn: document.getElementById('question-delete-btn'),
        questClearBtn: document.getElementById('questions-clear-btn')
    };
    
    return {
        getDomItems: domItems,
        
        addInputsDynamically: function() {
            
            var addInput = function() {
                //console.log('Works');
                
                var inputHTML, z;//z is an counter
                z = document.querySelectorAll(".admin-option").length;
                
                inputHTML = '<div class="admin-option-wrapper"><input type="radio" class="admin-option-' + z + '" name="answer" value="' + z + '"><input type="text" class="admin-option admin-option-' + z + '" value=""></div>';
                domItems.adminOptionsContainer.insertAdjacentHTML('beforeend', inputHTML);
                domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus', addInput);
                domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
   

             }            
        domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
        },
        
        createQuestionList: function(getQuestions) {
            // 86          // 91
            var questHTML, numberingArr;
            // 92
            numberingArr = [];
            // 82
            // console.log(getQuestions);
            // 84
            domItems.insertedQuestsWrapper.innerHTML = "";
            // 85
            for(var i = 0; i < getQuestions.getQuestionCollection().length; i++) {
                // 93
                numberingArr.push(i + 1);
                // 87                     // 94                    // 88
                questHTML = '<p><span>' + numberingArr[i] + '. ' + getQuestions.getQuestionCollection()[i].questionText + '</span><button id="question-' + getQuestions.getQuestionCollection()[i].id + '">Edit</button></p>';
                // 95
                // console.log(getQuestions.getQuestionCollection()[i].id);
                // 89
                domItems.insertedQuestsWrapper.insertAdjacentHTML('afterbegin', questHTML);
            }
        },
        
        editQuestList: function(event, storageQuestList, addInpsDynFn, updateQuestListFn) {
            
            var getId, getStorageQuestList,foundItem, placeInArr;
            //? 'question-'
            if('question-'.indexOf(event.target.id)) {
                
               getId = parseInt(event.target.id.split('-')[1]); 
                //console.log(event.target.id);
               getStorageQuestList = storageQuestList.getQuestionCollection();
                
               for(var i = 0; i < getStorageQuestList.length; i++) {
                   
                   if(getStorageQuestList[i].id === getId) {
                       foundItem = getStorageQuestList[i];
                       placeInArr = i;
                   }
               }
                
               // console.log(foundItem, placeInArr);
                
                domItems.newQuestionText.value = foundItem.questionText;//show question text after clicking edit button.   questionText 在最早出现的quizCtrl里敲错了，导致questionList一直显示undefined...
                domItems.adminOptionsContainer.innerHTML = '';
                optionHTML = '';
                for(var x = 0; x < foundItem.options.length; x++) {
                    optionHTML += '<div class="admin-option-wrapper"><input type="radio" class="admin-option-' + x + '" name="answer" value="' + x + '"><input type="text" class="admin-option admin-option-' + x + '" value="'+ foundItem.options[x] + '"></div>';
                }
                //console.log(optionHTML);
                domItems.adminOptionsContainer.innerHTML = optionHTML;
                domItems.questDeleteBtn.style.visibility = 'visible';
                domItems.questUpdateBtn.style.visibility = 'visible';
                domItems.questionInsertBtn.style.visibility = 'hidden';
                domItems.questClearBtn.style.pointerEvents = 'none';
                             
                addInpsDynFn();
                
               // console.log(foundItem);
                
                var updateQuestion = function() {
                    //console.log('Works');
                    var newOptions, optionEls;
                    newOptions = [];
                    optionEls = document.querySelectorAll('.admin-option');
                    foundItem.questionText = domItems.newQuestionText.value;
                    foundItem.correctAnswer = '';
                    for(var i = 0; i < optionEls.length; i++) {
                        if(optionEls[i].value !== '') {
                            newOptions.push(optionEls[i].value);
                            //as a condition we need to indicate the proper radio button as checked as you remember radio buttons are placed in the document as previous siblings for text inputs.
                            if(optionEls[i].previousElementSibling.checked) {//property checked which returns boolean value.
                                foundItem.correctAnswer = optionEls[i].value;
                            }
                        }
                    }
                    foundItem.options = newOptions;
                    if(foundItem.questionText !== '') {
                        if(foundItem.options.length > 1) {
                            if(foundItem.correctAnswer !== '') {
                                getStorageQuestList.splice(placeInArr, 1, foundItem);
                                storageQuestList.setQuestionCollection(getStorageQuestList);
                                domItems.newQuestionText.value = '';
                                for(var i = 0; i < optionEls.length; i++) {
                                    optionEls[i].value = '';
                                    optionEls[i].previousElementSibling.checked = false;
                                }
                                domItems.questDeleteBtn.style.visibility = 'hidden';
                                domItems.questUpdateBtn.style.visibility = 'hidden';
                                domItems.questionInsertBtn.style.visibility = 'visible';
                                domItems.questClearBtn.style.pointerEvents = '';
                                updateQuestListFn(storageQuestList);
                                //updateQuestListFn is a call back function
                                 }else {
                                     alert('You missed to check correct answer, or you checkd answer without value');
                                 }
                        }else {
                        alert('You must insert at least two options');
                        }
                    }else {
                        alert('Please, insert question');
                    }
                    
                    //console.log(foundItem);
                }
                domItems.questUpdateBtn.onclick = updateQuestion;
            } 
            //console.log(getId);
            //console.log(event, storageQuestList);
        }
    };
    
})(); 


/**************************
*******CONTROLLER*******
**************************/
var controller = (function(quizCtrl, UICtrl) {
    var selectedDomItems = UICtrl.getDomItems;
    UICtrl.addInputsDynamically();
    UICtrl.createQuestionList(quizCtrl.getQuestionOnLocalStorage);
    //click must be lowercases!!!!!!!!!!!
    selectedDomItems.questionInsertBtn.addEventListener('click', function() {
        var adminOptions = document.querySelectorAll('.admin-option');
       // console.log('Works');
     
        var checkBoolean = quizCtrl.addQuestionOnLocalStorage(selectedDomItems.newQuestionText, adminOptions);//check if the question be added correctly
        
        if(checkBoolean) {
            UICtrl.createQuestionList(quizCtrl.getQuestionOnLocalStorage);// if true, create question list again
        } //To make the question added to list dynamically without any reloading.
        
    });
    
    selectedDomItems.insertedQuestsWrapper.addEventListener('click', function(e) {
        UICtrl.editQuestList(e, quizCtrl.getQuestionOnLocalStorage, UICtrl.addInputsDynamically, UICtrl.createQuestionList);
    });
    
})(quizController, UIController);