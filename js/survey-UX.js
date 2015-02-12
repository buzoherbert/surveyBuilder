var superString = '{"Survey":{"Chapters":[{"Chapter":"Chapter 2","Questions":[{"id":"q11","Question":"How many children do you have?","Kind":"LP","Questions":[{"id":"q12","Question":"Does he or she live with you?","Kind":"MC","Other":true,"Answers":[{"Answer":"Yes"},{"Answer":"No"}]},{"id":"q13","Question":"What’s his or her age?","Kind":"ON"},{"id":"q14","Question":"Take a picture of him or her.","Kind":"IM"},{"id":"q15","Question":"What cartoon does he or she like?","Kind":"CB","Other":true,"Answers":[{"Answer":"Pokémon"},{"Answer":"Spirited Away"},{"Answer":"My Little Pony"}]}]},{"id":"q16","Question":"Order the elements of this list in order of importance for his or her well being","Kind":"OL","Answers":[{"Answer":"Nutrition"},{"Answer":"Education"},{"Answer":"Leisure time"}]},{"id":"q17","Question":"How many children do you have?","Kind":"LP","Questions":[{"id":"q18","Question":"SEEEEE?","Kind":"MC","Other":true,"Answers":[{"Answer":"Yes"},{"Answer":"No"}]}]},{"id":"q19","Question":"Order the elements of this list in order of importance for his or her well being","Kind":"OL","Answers":[{"Answer":"Nutrition"},{"Answer":"Education"},{"Answer":"Leisure time"}]},{"id":"q20","Question":"How many children do you have?","Kind":"LP","Questions":[{"id":"q21","Question":"SEEEEE?","Kind":"CB","Other":true,"Answers":[{"Answer":"Yes"},{"Answer":"No"}]}]},{"id":"q22","Question":"Order the elements of this list in order of importance for his or her well being","Kind":"OL","Answers":[{"Answer":"Nutrition"},{"Answer":"Education"},{"Answer":"Leisure time"}]}]}],"TableID":"11lGsm8B2SNNGmEsTmuGVrAy1gcJF9TQBo3G1Vw0"},"Tracker":{"Questions":[{"id":"q1","Question":"Bus","Kind":"MC","Other":true,"Answers":[{"Answer":"Route 15"},{"Answer":"Route 64"}]},{"id":"q2","Question":"Passenger total","Kind":"ON"}],"TableID":"1Q2mr8ni5LTxtZRRi3PNSYxAYS8HWikWqlfoIUK4"}}'
    	var projectTest = new project();
    	projectTest.constructFromString(superString);
    	console.log(superString);
    	console.log(JSON.stringify(projectTest.generateJSON()));

    	var projectView = new projectView(projectTest);
    	var container = document.getElementById("project_container");
    	container.appendChild(projectView.getView());

    	// Here we put the ux elements
    	// Only constructors to apply the bootstrap classes and to change the format quickly.
    	function button(kind, nodeClass, text){
    		var button = document.createElement("button");;
    		if(kind == "add"){
    			button.className =  "btn btn-primary btn-sm" + " " + nodeClass;
    			button.innerHTML = '<span class="glyphicon glyphicon-plus"></span> ' + text;
    		} else if (kind == "remove"){
    			button.className =  "btn btn-danger btn-xs" + " " + nodeClass;
    			button.innerHTML = '<span class="glyphicon glyphicon-remove"></span> ' + text;
    		} else {
    			button.className =  "btn btn-default btn-sm"+ " " + nodeClass;
    			button.innerHTML = " " + text + "XX";
    		}
    		return button;
    	}
    	function select(kind, nodeClass, dropdownTextArray, dropdownValueArray){
    		this.kind = kind;
    		this.nodeClass = nodeClass;
    		this.dropdownTextArray = dropdownTextArray;
    		var select = document.createElement("select");
    		select.className = "form-control" + " " + nodeClass;
    		for (var i=0; i < dropdownTextArray.length; i++){
    			option = document.createElement("option");
    			option.value = dropdownValueArray[i];
    			option.innerHTML = dropdownTextArray[i];
    			select.appendChild(option);
    		}
    		return select;
    	}
    	function checkbox(kind, labelText, nodeClass){
    		this.checkbox = document.createElement("input");
			this.checkbox.type = "checkbox";
			this.checkbox.className = "bootstrap-switch" + " " + nodeClass;
    		this.addTo = function(div){
    			var that = this;
    			div.appendChild(this.checkbox);
    			$(this.checkbox).bootstrapSwitch("labelText", labelText);
    		};
    		this.removeFrom = function(div){
    			this.checkbox.name = "switch-to-remove";
    			$(this.checkbox).bootstrapSwitch('destroy');
    			this.checkbox.name = "";
    			div.removeChild(this.checkbox);
    		}
    		this.isChecked = function(){
    			return this.checkbox.checked;
    		}
    		this.getView = function(){
    			return this.checkbox;
    		}
    		this.toggleState = function(){
    			$(this.checkbox).bootstrapSwitch('toggleState');
    		}
    		this.setCheckedState = function(state){
    			if(this.checkbox.checked != state){
    				this.toggleState();
    			}
    		}

    	}
    	// Here be the Views
    	// !!/!T(&"#("/!(/T#")(/!=)/"=)(!)(YEU!")/H)"(UWE=")!"(!=)(!=#)(=))))
		function projectView(project){			
			this.initializeView = function(){
				this.div = document.createElement('div');
				this.div.className = "project";
				this.div.id = "project";
				this.floatDiv = document.getElementById('JsonGoesHere');
				this.jsonText = document.createElement("div");
				this.jsonText.style.cssText = 'font-size:0.75em';
				this.floatDiv.appendChild(this.jsonText)
			}
			this.updateContent = function(project){
				this.project = project;
				if (this.project.getSurvey() != null){
					this.surveyView = new surveyView(this.project.getSurvey(), this);
				} else {
					this.surveyView = new surveyView(new survey(), this);
				}
				if (this.project.getTracker() != null){
					this.trackerView = new trackerView(this.project.getTracker(), this);
				} else {
					this.trackerView = new trackerView(new tracker(), this);
				}
				while (this.div.firstChild){
					this.div.removeChild(this.div.firstChild);
				}				
				this.div.appendChild(this.surveyView.getView());
				this.div.appendChild(this.trackerView.getView());			
			}
			this.getView = function(){
				return this.div;
			};
			this.contentChanged = function(){
				this.project.setSurvey(this.surveyView.getSurvey());
				this.project.setTracker(this.trackerView.getTracker());
				this.contentChanges++;
				this.jsonText.innerHTML = "<b>Input Modification Count:</b> " + this.contentChanges + " <br><br><b>JSON Output:</b><br>" + JSON.stringify(project.generateJSON());
			};
			this.project = project;
			this.contentChanges = -1;
			this.initializeView();
			this.updateContent(this.project);
			this.contentChanged();
		}
		function surveyView(survey, parentView){
         	this.initializeView = function(){
         		this.div = document.createElement('div');
         		this.div.className = "survey";
         		var that = this;
         		this.addChapterButton = new button("add", "", "Add chapter");
         		this.addChapterButton.onclick = function(){
         			that.addChapter(new chapter());
         			that.contentChanged();
         		};
         		this.fusionTableIDInput = document.createElement("input");
         		this.fusionTableIDInput.type = "text";
         		this.fusionTableIDInput.className = "form-control"
         		this.fusionTableIDInput.oninput=function(){
         			that.contentChanged();
         		};
         		this.chaptersArrayContainerDiV = document.createElement('div');
         		this.chaptersArrayContainerDiV.className = "chaptersArrayContainerDiV";
         		this.chaptersContainerDIV = document.createElement('div');
         		this.chaptersContainerDIV.className = "chaptersContainerDIV";
         		this.chaptersContainerDIV.appendChild(this.chaptersArrayContainerDiV);
         		this.chaptersContainerDIV.appendChild(this.addChapterButton);
         		this.div.appendChild(this.fusionTableIDInput);
         		this.div.appendChild(this.chaptersContainerDIV);
         	}
         	this.updateContent = function(survey){
         		this.survey = survey;
         		if (this.fusionTableIDInput.value != this.survey.getfusionTableID()){
         			this.fusionTableIDInput.value = this.survey.getfusionTableID();
         		}
         		if (this.chapters != this.survey.getChapters()){	
         			this.chapterViews = [];
         			while (this.chaptersArrayContainerDiV.firstChild){
         				this.chaptersArrayContainerDiV.removeChild(this.chaptersArrayContainerDiV.firstChild);
         			}
         			this.chapters = this.survey.getChapters();
         			for (var i = 0; i < this.chapters.length; i++) {
         				this.addChapter(this.chapters[i]);
         			};
         		}
         	}	
			this.getView = function(){
				return this.div;
			}
			this.addChapter = function(chapter){	
				var chapterContainerDIV = document.createElement('div');
         		chapterContainerDIV.className = "chapterContainerDIV";
				var newChapterView = new chapterView(chapter, this);
				this.chapterViews.push(newChapterView);
				var newChapterDIV = newChapterView.getView();
				var eraseChapterButton = new button("remove", "", "Erase chapter");
				var that = this;
				chapterContainerDIV.appendChild(eraseChapterButton);
				chapterContainerDIV.appendChild(newChapterDIV);
				this.chaptersArrayContainerDiV.appendChild(chapterContainerDIV);
				eraseChapterButton.onclick = function(){
            		that.eraseChapter(chapterContainerDIV);
        		}
			}
			this.eraseChapter = function(chapterDIV){
				var parentChilds = chapterDIV.parentNode.childNodes;
				for (var i=0; i < parentChilds.length; i++){
					if (parentChilds[i] == chapterDIV){
						this.chapterViews.splice(i,1);
						break
					}
				}
				this.chaptersArrayContainerDiV.removeChild(chapterDIV);
				this.contentChanged();
			}
			this.contentChanged = function(){
				var changedChapters = [];
				for(i=0; i<this.chapterViews.length; i++){
					changedChapters[i] = this.chapterViews[i].getChapter();
				}
				this.survey.setChapters(changedChapters);
				this.survey.setfusionTableID(this.fusionTableIDInput.value);
				this.parentView.contentChanged();
			};	
			this.getSurvey = function(){
				return this.survey;
			}
			this.parentView = parentView;
			this.survey = survey;
			this.chapterViews = []; // Instances of chapters
			this.div = null;
			this.addChapterButton = null;
			this.fusionTableIDInput = null;
			this.chaptersContainerDIV = null;
			this.chaptersArrayContainerDiV = null;
			this.initializeView();
			this.updateContent(this.survey);
		}
		function questionArrayView(questionArray, parentView, inLoop){
			this.initializeView = function(){
				this.div = document.createElement('div');
				this.div.className = "questionsContainerDIV";
				this.questionsArrayContainer = document.createElement('div');
				this.questionsArrayContainer.className = "questionsArrayContainer";
				this.addQuestionButton = new button("add", "", "Add question");
				var that = this;
				this.addQuestionButton.onclick = function(){
					that.addQuestion(new question(that.inLoop));
					that.contentChanged();
				};
				this.div.appendChild(this.questionsArrayContainer);
				this.div.appendChild(this.addQuestionButton);
			}
			this.updateContent = function(questionArray){
         		if (questionArray != this.getQuestions()){	
         			this.QuestionViews = [];
         			while (this.questionsArrayContainer.firstChild){
         				this.questionsArrayContainer.removeChild(this.questionsArrayContainer.firstChild);
         			}
         			this.questionArray = questionArray;
         			if(this.questionArray != null){
                  		for (var i = 0; i < this.questionArray.length; i++) {
         					this.addQuestion(this.questionArray[i]);
         				};				
         			}
         		}
			}
			this.addQuestion = function(question){
				var questionContainerDIV = document.createElement('div');
				questionContainerDIV.className = "questionContainerDIV";
				newQuestionView = new questionView(question, this, inLoop);
				this.questionViews.push(newQuestionView);
				var newQuestionDIV = newQuestionView.getView();
				var eraseQuestionButton = new button("remove", "", "Erase question");
				var that = this;
				questionContainerDIV.appendChild(eraseQuestionButton);
				questionContainerDIV.appendChild(newQuestionDIV);
				this.questionsArrayContainer.appendChild(questionContainerDIV);
				eraseQuestionButton.onclick = function(){
					that.eraseQuestion(questionContainerDIV);
				};
			};
			this.eraseQuestion = function(questionDIV){
				var parentChilds = questionDIV.parentNode.childNodes;
				for (var i=0; i < parentChilds.length; i++){
					if (parentChilds[i] == questionDIV){
						this.questionViews.splice(i,1);
						break
					};
				};
				this.questionsArrayContainer.removeChild(questionDIV);
				this.contentChanged();
			};
			this.contentChanged = function(){
				this.parentView.contentChanged();
			};	
			this.getView = function(){
				return this.div;
			}
			this.getQuestions = function(){
				this.questionArray = [];
				for(i=0; i<this.questionViews.length; i++){
					this.questionArray[i] = this.questionViews[i].getQuestion();
				};
				return this.questionArray;
			};
			this.inLoop = inLoop;
			this.questionArray = questionArray;
			this.parentView = parentView;
			this.questionViews = []; //Array of question Views objects
			this.initializeView();
			this.updateContent(this.questionArray);	
		};

		function answerArrayView(answerArray, parentView, canHaveJumps){
			this.initializeView = function(){
         		this.answerViews = []; //Array of question Views objects
				this.div = document.createElement('div');
				this.div.className = "answersContainerDIV";
				this.answersArrayContainer = document.createElement('div');
				this.answersArrayContainer.className = "this.answersArrayContainerDIV";
				this.addAnswerButton = new button("add", "", "Add answer");
				var that = this;
				this.addAnswerButton.onclick = function(){
					that.addAnswer(new answer());
					that.contentChanged();
	         	};
	         	this.div.appendChild(this.answersArrayContainer);
	         	this.div.appendChild(this.addAnswerButton);
	        }
	        this.updateContent = function(answerArray){
	        	if (answerArray != this.getAnswers()){	
         			this.AnswerViews = [];
         			while (this.answersArrayContainer.firstChild){
         				this.answersArrayContainer.removeChild(this.answersArrayContainer.firstChild);
         			}
         			this.answerArray = answerArray;
         			if(answerArray != null){
         				for (var i = 0; i < this.answerArray.length; i++) {
         					this.addAnswer(this.answerArray[i]);
         				};
         			}
         		}
			}         	
			this.addAnswer = function(answer){
				var answerContainerDIV = document.createElement('div');
         		answerContainerDIV.className = "answerContainerDIV";
				var newAnswerView = new answerView(answer, this, this.canHaveJumps);
				this.answerViews.push(newAnswerView);
				var newAnswerDIV = newAnswerView.getView();
				var eraseAnswerButton = new button("remove", "", "Erase answer");
				answerContainerDIV.appendChild(eraseAnswerButton);
				answerContainerDIV.appendChild(newAnswerDIV);
				this.answersArrayContainer.appendChild(answerContainerDIV);
				var that = this;
				eraseAnswerButton.onclick = function(){
            		that.eraseAnswer(answerContainerDIV);
            	};
			};
			this.eraseAnswer = function(answerDIV){
				var parentChilds = answerDIV.parentNode.childNodes;
				for (var i=0; i < parentChilds.length; i++){
					if (parentChilds[i] == answerDIV){
						this.answerViews.splice(i,1);
						break
					}
				}
				this.answersArrayContainer.removeChild(answerDIV);
				this.contentChanged();
			};
			this.contentChanged = function(){
				parentView.contentChanged();
			};	
			this.getView = function(){
				return this.div;
			}
			this.getAnswers = function(){
				var answers = [];
				for(i=0; i<this.answerViews.length; i++){
					answers[i] = this.answerViews[i].getAnswer();
				}
				return answers;
			}
			this.answerArray = answerArray;
			this.parentView = parentView;
			this.canHaveJumps = canHaveJumps;
			this.initializeView();
			this.updateContent(this.answerArray);
		}
		function answerView(answer, parentView, canHaveJump){
			this.initializeView = function(){
				this.div = document.createElement('div');
				this.div.className = "answer";
				var that = this;
				this.answerInput = document.createElement("input");
				this.answerInput.type = "text";
				this.answerInput.className = "form-control";
				this.answerInput.oninput=function(){
					that.contentChanged();
				};
				this.jumpInput = document.createElement("input");
				this.jumpInput.type = "text";
				this.jumpInput.className = "form-control";
				this.jumpInput.style.display = "none";
				this.jumpInput.oninput=function(){
					that.contentChanged();
				};

				this.jumpCheckbox = new checkbox("", "Jump", "jumpEnabled");
				this.jumpCheckbox.getView().checked = false;
				this.jumpCheckbox.getView().onchange = function(){
					that.toggleJumpOption();
				};

				this.div.appendChild(this.answerInput);
				if(canHaveJump){
					this.jumpCheckbox.addTo(this.div);
					this.div.appendChild(this.jumpInput);	
				};
			};
         	this.updateContent = function(answer){
         		this.answer = answer;
         		if (this.answerInput.value != this.answer.getAnswerText()){
         			this.answerInput.value = this.answer.getAnswerText();
         		}	
         		if ((this.answer.getJumpID() != null) && (this.canHaveJump)){
         			this.jumpCheckbox.setCheckedState(true);
         			this.toggleJumpOption();
         			this.jumpInput.value = this.answer.getJumpID();
         		} else {
         			this.jumpCheckbox.setCheckedState(false);
         		}
			}  			
			this.getView = function(){
				return this.div;
			};
			this.contentChanged = function(){
				this.answer.setAnswerText(this.answerInput.value); 
				this.answer.setjumpID(this.jumpInput.value);	
				parentView.contentChanged();
			};
			this.getAnswer = function(){
				return this.answer;
			};
			this.toggleJumpOption = function(){
				if(this.jumpCheckbox.isChecked()){
					this.jumpInput.style.display = "inherit";
				} else {
					this.jumpInput.style.display = "none";
					if (this.jumpInput.value != ""){
						this.jumpInput.value = "";
						this.contentChanged();
					}
				}
			}
			this.canHaveJump = canHaveJump;
			this.answer = answer;
			this.parentView = parentView;
			this.jumpCheckbox = null;
			this.answerInput = null;
			this.jumpInput = null;
			this.initializeView();
			this.updateContent(this.answer);
		};
		function chapterView(chapter, parentView) {
			this.updateContent = function(chapter){
         		if (this.titleInput.value != this.chapter.getTitle()){
         			this.titleInput.value = this.chapter.getTitle();
         		}				
				if (this.questionArrayView != null){
					if(this.chapter.getQuestions() != this.questionArrayView.getQuestions()){
						this.questionArrayView.updateContent(this.chapter.getQuestions);
					}
				} else {
					this.questionArrayView = new questionArrayView(this.chapter.getQuestions(), this, false);
					this.div.appendChild(this.questionArrayView.getView());
				}
			}  			
			this.initializeView = function(){
				this.div = document.createElement('div');
				this.div.className = "chapter";
				var that = this;
				this.titleInput = document.createElement("input");
				this.titleInput.type = "text";
				this.titleInput.className = "form-control"
				this.titleInput.oninput=function(){
					that.contentChanged();
				};
				this.div.appendChild(this.titleInput);
			}	
			this.getView = function(){
				return this.div;
			}
			this.getChapter = function(){
				return this.chapter;
			}
			this.contentChanged = function(){
				this.chapter.setQuestions(this.questionArrayView.getQuestions());
				this.chapter.setTitle(this.titleInput.value); 
				this.parentView.contentChanged();
			};
			this.chapter = chapter;
			this.parentView = parentView;
			this.initializeView();
			this.updateContent(this.chapter);
		};
		function trackerView(tracker, parentView){
			this.initializeView = function(){
				this.div = document.createElement('div');
				this.div.className = "tracker";
				var that = this;
				this.fusionTableIDInput = document.createElement("input");
				this.fusionTableIDInput.type = "text";
				this.fusionTableIDInput.className = "form-control"
				this.fusionTableIDInput.oninput=function(){
					that.contentChanged();
				};			
				this.div.appendChild(this.fusionTableIDInput);
			}
			this.updateContent = function(tracker){
				this.tracker = tracker;
         		if (this.fusionTableIDInput.value != this.tracker.getfusionTableID()){
         			this.fusionTableIDInput.value = this.tracker.getfusionTableID();
         		}
         		if (this.questionArrayView != null){
         			if(this.tracker.getQuestions() != this.questionArrayView.getQuestions()){
         				this.questionArrayView.updateContent(this.tracker.getQuestions);
         			}
         		} else {
         			this.questionArrayView = new questionArrayView(this.tracker.getQuestions(), this, false);
         			this.div.appendChild(this.questionArrayView.getView());
         		}
			} 			
			this.getView = function(){
				return this.div;
			}
			this.getTracker = function(){
				return this.tracker;
			}
			this.contentChanged = function(){
				this.tracker.setQuestions(this.questionArrayView.getQuestions());
				this.tracker.setfusionTableID(this.fusionTableIDInput.value);
				this.parentView.contentChanged();
			};
			this.tracker = tracker;
			this.parentView = parentView;
			
			this.initializeView();
			this.updateContent(this.tracker);
		}
		function questionView(question, parentView, inLoop) {
			this.updateContent = function(question){
				this.question = question;
				if (this.questionInput.value != this.question.getQuestionText()){
         			this.questionInput.value = this.question.getQuestionText();
         		}
				if (this.IDInput.value != this.question.getQuestionID()){
         			this.IDInput.value = this.question.getQuestionID();
         		}         
         		if (this.questionKindDropDown.options[this.questionKindDropDown.selectedIndex].value != this.question.getKind()){
         			var indexToSelect;
         			for (var i = this.questionKindDropDown.options.length - 1; i >= 0; i--) {
         				if (this.questionKindDropDown.options[i].value == this.question.getKind()){
         					indexToSelect = i;
         					break;
         				}
         			};
         			this.questionKindDropDown.selectedIndex = indexToSelect;
         			this.updateQuestionKind(this.question.getKind());
         		}
         		if ((this.question.getJumpID() != null) && (!this.inLoop)){
         			this.jumpCheckbox.setCheckedState(true);
         			this.toggleJumpOption();
         			this.jumpInput.value = this.question.getJumpID();
         		} else {
         			this.jumpCheckbox.setCheckedState(false);
         		}
         		if ((this.question.isOtherEnabled() != null) && ((this.question.getKind() == this.questionKinds.MULTIPLE_CHOICE["jsonName"]) || (this.question.getKind() == this.questionKinds.CHECKBOX["jsonName"]))){
         			var tempOnchangeFunction = this.otherCheckbox.getView().onchange;
         			this.otherCheckbox.getView().onchange = function(){};
         			this.otherCheckbox.setCheckedState(this.question.isOtherEnabled());
         			this.otherCheckbox.getView().onchange = tempOnchangeFunction;
         		}		
			} 			

			this.initializeView = function(){
				this.div = document.createElement('div');
				this.div.className = "question";
				this.IDInput = document.createElement("input");
				this.IDInput.type = "text";
				this.IDInput.className = "form-control"
				var that = this;
				this.IDInput.oninput=function(){
					that.contentChanged();
				};
				this.questionInput = document.createElement("input");
				this.questionInput.type = "text";
				this.questionInput.className = "form-control"
				this.questionInput.oninput = function(){
					that.contentChanged();
				};

				this.questionKindDropDown = new select("", "", this.questionKinds.getNames(), this.questionKinds.getJsonNames());
				this.questionKindDropDown.onchange = function(){
					that.updateQuestionKind(this.options[this.selectedIndex].value);
					that.contentChanged();
				};

				this.jumpInput = document.createElement("input");
				this.jumpInput.type = "text";
				this.jumpInput.checkboxlassName = "form-control"
				this.jumpInput.style.display = "none";
				this.jumpInput.oninput = function(){
					that.contentChanged();
				};

				this.jumpCheckbox = new checkbox("", "Jump", "jumpEnabled");
				this.jumpCheckbox.getView().onchange = function(){
					that.toggleJumpOption();
				};

				this.div.appendChild(this.IDInput);
				this.div.appendChild(this.questionInput);	
				if (!this.inLoop){
					this.jumpCheckbox.addTo(this.div);
				}
				this.div.appendChild(this.jumpInput);	
				this.div.appendChild(this.questionKindDropDown);	
			}
			this.getView = function(){
				return this.div;
			}			
			this.contentChanged = function(){
				this.question.setQuestionText(this.questionInput.value); 
				this.question.setQuestionID(this.IDInput.value);	
				if (this.jumpInput.value == ""){
					this.question.setjumpID(null);
				} else{
					this.question.setjumpID(this.jumpInput.value);
				}
				if (this.answerArrayView != null){
					this.question.setAnswers(this.answerArrayView.getAnswers());
				} else{	
					this.question.setAnswers(null);
				}
				if (this.questionArrayView != null){
					this.question.setLoopQuestions(this.questionArrayView.getQuestions());
				} else{
					this.question.setLoopQuestions(null);
				}
				if (this.otherCheckbox != null){
					this.question.setOtherEnabled(this.otherCheckbox.isChecked());
				} else{
					this.question.setOtherEnabled(null);
				}
				this.question.setKind(this.questionKindDropDown.options[this.questionKindDropDown.selectedIndex].value);
				this.parentView.contentChanged();
			};
			this.getQuestion = function(){
				return this.question;
			}
			this.toggleJumpOption = function(){
				if(this.jumpCheckbox.isChecked()){
					this.jumpInput.style.display = "inherit";
				} else {
					this.jumpInput.style.display = "none";
					if (this.jumpInput.value != ""){
						this.jumpInput.value = "";
						this.contentChanged();
					}
				}
			}
			this.updateQuestionKind = function(newQuestionKind){
				switch(newQuestionKind){
					// We don't need arrays
					case this.questionKinds.OPEN_TEXT["jsonName"]:
					case this.questionKinds.OPEN_NUMBER["jsonName"]: 
					case this.questionKinds.IMAGE["jsonName"]:
						this.removeOtherOption();
						this.removeAnswerArray();
						this.removeQuestionArray();
						break;
					// We need an answers array
					case this.questionKinds.ORDERED["jsonName"]:
						this.removeQuestionArray();
						this.removeOtherOption();
						this.addAnswerArray();	
						break;					
					case this.questionKinds.MULTIPLE_CHOICE["jsonName"]:
					case this.questionKinds.CHECKBOX["jsonName"]:
						this.addOtherOption();
						this.removeQuestionArray();
						this.addAnswerArray();	
						break;
					// We need a question array
					case this.questionKinds.LOOP["jsonName"]:
						this.removeOtherOption();
						this.removeAnswerArray();
						this.addQuestionArray();
						break;	
				}
			}
			this.addQuestionArray = function(){
				if (this.questionArrayView == null){
					this.questionArrayView = new questionArrayView(this.question.getLoopQuestions(), this, true);
					this.div.appendChild(this.questionArrayView.getView());
				}				
			}
			this.addAnswerArray = function(){
				if (this.answerArrayView == null){
					var canHaveJump = false;
					if((this.questionKindDropDown.options[this.questionKindDropDown.selectedIndex].value == this.questionKinds.MULTIPLE_CHOICE["jsonName"]) && !this.inLoop){
						canHaveJump = true;
					}
					this.answerArrayView = new answerArrayView(this.question.getAnswers(), this, canHaveJump);
					this.div.appendChild(this.answerArrayView.getView());
				}
			}
			this.removeQuestionArray = function(){
				if (this.questionArrayView != null){
					this.div.removeChild(this.questionArrayView.getView());
					this.questionArrayView = null;
				}
			}
			this.removeAnswerArray = function(){
				if (this.answerArrayView != null){
					this.div.removeChild(this.answerArrayView.getView());
					this.answerArrayView = null;
				}
			}
			this.addOtherOption = function(){
				if (this.otherCheckbox == null){
					this.otherCheckbox = new checkbox("", "Other", "otherEnabled");
					var that = this;
					this.otherCheckbox.getView().onchange = function(){
						that.contentChanged();
					};
					this.otherCheckbox.addTo(this.div);
				}
			}
			this.removeOtherOption = function(){
				if (this.otherCheckbox != null){
					this.otherCheckbox.removeFrom(this.div);
					this.otherCheckbox = null;
				}
			}			

			this.question = question;
			this.parentView = parentView;
			this.inLoop = inLoop;
			this.questionKinds = new questionKind(this.inLoop);
			this.answerArrayView = null;
			this.questionArrayView = null;
			this.questionKindDropDown = null;
			this.otherCheckbox = null;
			this.IDInput = null;
			this.questionInput = null;
			this.questionKindDropDown = null;
			this.jumpInput = null;
			this.jumpCheckbox = null;
			this.initializeView();
			this.updateContent(this.question);
		};

		// Part of the code for the models of the data
		///"&)(!/=)"!/=)/"!?/((/&(&%"!(&/=")/)"!(??"!)"=)?/")!=/!&"/!&?#&*)
		function answer() {
			this.answerText = null; // String
			this.jumpID = null; // String
			this.getAnswerText = function() {
				return this.answerText;
			};
			this.setAnswerText = function(answerText) {
				this.answerText = answerText;
			};
			this.getJumpID = function() {
				return this.jumpID;
			};
			this.setjumpID = function(jumpID) {
				this.jumpID = jumpID;
			};
			this.generateJSON = function(){  		
				var answerJSON = {};
				if (this.answerText != null){
					answerJSON["Answer"] = this.answerText;
				}
				if (this.jumpID != null){
					answerJSON["Jump"] = this.jumpID;
				}
  				return answerJSON;
  			}
  			this.constructFromJSON = function(object){
  				if("Answer" in object){
  					this.answerText = object["Answer"];
  				} else {
  					console.log("No answer text in answer object :-(");
  				}
  				if("Jump" in object){
  					this.jumpID = object["Jump"];
  				} else {

  				}
  			}
		};

		function question(inLoop) {
			this.inLoop = inLoop; // Boolean to know if inside loop
			this.kind = null;
			this.loopQuestions = []; // Question instances inside this question.
			this.questionText = null; // String
			this.answers = []; // Answer instances
			this.questionID = null; // String
			this.otherEnabled = null; // Boolean 
			this.jumpID = null; // String
			this.getKind = function() {
				return this.kind;
			};
			this.setKind = function(kind) {
				this.kind = kind;
			};
			this.getQuestionText = function() {
				return this.questionText;
			};
			this.setQuestionText = function(questionText) {
				this.questionText = questionText;
			};
			this.getAnswers = function() {
				return this.answers;
			};
			this.setAnswers = function(answers) {
				this.answers = answers;
			};
			this.getJumpID = function() {
				return this.jumpID;
			};
			this.setjumpID = function(jumpID) {
				this.jumpID = jumpID;
			};
			this.getQuestionID = function() {
				return this.questionID;
			};
			this.setQuestionID = function(questionID) {
				this.questionID = questionID;
			};
			this.isOtherEnabled = function() {
				return this.otherEnabled;
			};
			this.setOtherEnabled = function(otherEnabled) {
				this.otherEnabled = otherEnabled;
			};
			this.getLoopQuestions = function() {
				return this.loopQuestions;	
			};
			this.setLoopQuestions = function(loopQuestions) {
				this.loopQuestions = loopQuestions;
			};
			this.generateJSON = function(){				
				var questionJSON = {};
  				questionJSON["Question"] = this.questionText;
  				questionJSON["id"] = this.questionID;
  				questionJSON["Kind"] = this.kind;
  				if (this.jumpID != null){
  					questionJSON["Jump"] = this.jumpID;
  				}
  				if (this.otherEnabled != null){
  					questionJSON["Other"] = this.otherEnabled;
  				}
 				if ((this.answers !== null) && (this.answers.length >0)){
  					var length = this.answers.length;
  					var answersArray = [];
  					for (var i = 0; i < length; i++) {
  						answersArray.push(this.answers[i].generateJSON());
  					};
  					questionJSON["Answers"] = answersArray;
  				}
  				if(this.loopQuestions != null){
  					var questionsJSONArray = [];
  					for(var i=0; i < this.loopQuestions.length; i++){
						questionsJSONArray.push(this.loopQuestions[i].generateJSON());
					}
					if (questionsJSONArray.length > 0){
						questionJSON["Questions"] = questionsJSONArray;
					}
  				}
  				return questionJSON;
  			}
  			this.constructFromJSON = function(object){
  				if("Kind" in object){
  					var tempKind = object["Kind"];
  					var qK = new questionKind(this.inloop);
  					var JSONNames = qK.getJsonNames();
  					var validQuestionKind = false;
  					for (i = 0; i < JSONNames.length; i++) {
  						if (JSONNames[i] === tempKind) {
  							this.kind = tempKind;
  							validQuestionKind = true;
  						}
  					}
  					if(!validQuestionKind){
  						console.log("Question kind in question object is not a valid value :-(");	
  					}
  				} else {
  					console.log("No question kind in question object :-(");
  				}
  				if("Jump" in object){
  					this.jumpID = object["Jump"];
  				} else {

  				}
  				if("Question" in object){
  					this.questionText = object["Question"];
  				} else {
  					console.log("No question text in question object :-(")
  				}
  				if("id" in object){
  					this.questionID = object["id"];
  				}
  				if((this.kind === qK.MULTIPLE_CHOICE.jsonName) || (this.kind === qK.CHECKBOX.jsonName)){
  					if("Other" in object){
  						this.otherEnabled = object["Other"];
  					} else {
  						this.otherEnabled = false;
  					}
  				}
  				if(((this.kind === qK.MULTIPLE_CHOICE.jsonName) || (this.kind === qK.CHECKBOX.jsonName)) || (this.kind === qK.ORDERED.jsonName)){
  					if("Answers" in object){
  						var objectAnswers = object["Answers"];
  						if(Array.isArray(objectAnswers)){
  							this.answers = [];
  							for(var i=0; i < objectAnswers.length; i++){
  								this.answers.push(new answer());
  								this.answers[i].constructFromJSON(objectAnswers[i]);
  							}
  						}  else {
  							console.log("Answers in question is not an Array :-(");
  						}
  					} else {
  						console.log("No answers in question object :-(");
  					}
  				}
  				if((this.kind === qK.LOOP.jsonName) && (this.inLoop == false)){
  					if("Questions" in object){
  						var objectQuestions = object["Questions"];
  						if(Array.isArray(objectQuestions)){
  							this.loopQuestions = [];
  							for(var i=0; i < objectQuestions.length; i++){
  								this.loopQuestions.push(new question(true));
  								this.loopQuestions[i].constructFromJSON(objectQuestions[i]);
  							}
  						}  else {
  							console.log("Questions in loop questions is not an Array :-(");
  						}
  					} else {
  						console.log("No questions in loop question object :-(");
  					}
  				}
  			}
		};
		function questionKind(inLoop){
			// Object to list the question kinds possible to add to a question array
			this.inLoop = inLoop;
			this.MULTIPLE_CHOICE = {
				jsonName:"MC",
				name:"Multiple choice"
			};
			this.OPEN_NUMBER = {
				jsonName:"ON",
				name:"Open number"
			};
			this.OPEN_TEXT = {
				jsonName:"OT",
				name:"Open text"
			};
			this.IMAGE = {
				jsonName:"IM",
				name:"Picture"
			};
			this.CHECKBOX = {
				jsonName:"CB",
				name:"Checkbox"
			};
			this.ORDERED = {
				jsonName:"OL",
				name:"Ordered list"
			};
			this.LOOP = {
				jsonName:"LP",
				name:"Loop"
			};
			this.getJsonNames = function(){
				var jsonNames = [];
				jsonNames.push(this.OPEN_TEXT["jsonName"]);
				jsonNames.push(this.OPEN_NUMBER["jsonName"]);				
				jsonNames.push(this.MULTIPLE_CHOICE["jsonName"]);
				jsonNames.push(this.CHECKBOX["jsonName"]);
				jsonNames.push(this.ORDERED["jsonName"]);
				jsonNames.push(this.IMAGE["jsonName"]);
				if(!this.inLoop){
					jsonNames.push(this.LOOP["jsonName"]);
				};
				return jsonNames;
			};
			this.getNames = function(){
				var names = [];
				names.push(this.OPEN_TEXT["name"]);
				names.push(this.OPEN_NUMBER["name"]);				
				names.push(this.MULTIPLE_CHOICE["name"]);
				names.push(this.CHECKBOX["name"]);
				names.push(this.ORDERED["name"]);
				names.push(this.IMAGE["name"]);
				if(!this.inLoop){
					names.push(this.LOOP["name"]);
				}
				return names;
			};
		};
		function chapter() {
		  	this.title = null; // String
		  	this.questions = []; //Array of question objects
		  	this.getTitle = function() {
		    	return this.title;
			};
			this.setTitle = function(title) {
				this.title = title;
			};
			this.getQuestions = function() {
				return this.questions;
			};
			this.setQuestions = function(questions) {
				this.questions = questions;
			};
			this.addQuestion = function(newQuestion){
				this.questions.push(newQuestion);
			};
			this.getQuestionCount = function() {
				if (this.questions == null){
					return 0
				} else {
					return this.questions.length;
				}
  			};
  			this.generateJSON = function(){
  				var chapterJSON = {};
				var questionsJSONArray = [];
				for(var i=0; i < this.questions.length; i++){
					questionsJSONArray.push(this.questions[i].generateJSON());
				}
				chapterJSON["Chapter"] = this.title;
				if (questionsJSONArray.length > 0){
					chapterJSON["Questions"] = questionsJSONArray;
				}
				return chapterJSON;
  			}
  			this.constructFromJSON = function(object){
				if("Questions" in object){
					var objectQuestions = object["Questions"];
					if(Array.isArray(objectQuestions)){
						this.questions = [];
						for(var i=0; i < objectQuestions.length; i++){
							this.questions.push(new question(false));
							this.questions[i].constructFromJSON(objectQuestions[i]);
						}
					}  else {
						console.log("Questions in chapter is not an Array :-(");
					}
				} else {
					console.log("No questions in chapter object :-(");
				}
				if("Chapter" in object){
					this.title = object["Chapter"];
				} else {
					console.log("No chapter title in object :-(");
				}
			}
		};
		function survey(){
			this.chapters = []; // Instances of chapters
			this.fusionTableID = null; // String

			this.getfusionTableID = function() {
				return this.fusionTableID;
			};
			this.setfusionTableID = function(fusionTableID) {
				this.fusionTableID = fusionTableID;
			};
			this.getChapters = function() {
				return this.chapters;
			};
			this.setChapters = function(chapters) {
				this.chapters = chapters;
			};
			this.addChapter = function(newChapter){
				this.chapters.push(newChapter);
			}
			this.getChapterCount = function() {
				if (this.chapters == null){
					return 0
				} else {
					return chapters.length;
				}
  			}
  			this.generateJSON = function(){
				var surveyJSON = {};
				var chaptersJSONArray = [];
				for(var i=0; i < this.chapters.length; i++){
					chaptersJSONArray.push(this.chapters[i].generateJSON());
				}
				surveyJSON["Chapters"] = chaptersJSONArray;
				surveyJSON["TableID"] = this.fusionTableID;
				return surveyJSON;
			}
			this.constructFromJSON = function(object){
				if("Chapters" in object){
					var objectChapters = object["Chapters"];
					if(Array.isArray(objectChapters)){
						this.chapters = [];
						for(var i=0; i < objectChapters.length; i++){
							this.chapters.push(new chapter());
							this.chapters[i].constructFromJSON(objectChapters[i]);
						}
					}  else {
						console.log("Chapters in survey is not an Array :-(");
					}
				} else {
					console.log("No chapters in survey object :-(");
				}
				if("TableID" in object){
					this.fusionTableID = object["TableID"];
				} else {
					console.log("No fusionTableID in survey object :-(");
				}
			}
		};
		function tracker(){
			this.questions = []; // Instances of questions
			this.fusionTableID = null; // String
			this.getfusionTableID = function() {
				return this.fusionTableID;
			};
			this.setfusionTableID = function(fusionTableID) {
				this.fusionTableID = fusionTableID;
			};
			this.getQuestions = function() {
			    return this.questions;
			};
			this.setQuestions = function(questions) {
				this.questions = questions;
			};
			this.generateJSON = function(){
				var trackerJSON = {};
				var questionsJSONArray = [];
				for(var i=0; i < this.questions.length; i++){
					questionsJSONArray.push(this.questions[i].generateJSON());
				}
				trackerJSON["Questions"] = questionsJSONArray;
				trackerJSON["TableID"] = this.fusionTableID;
				return trackerJSON;
			}
			this.constructFromJSON = function(object){
				if("Questions" in object){
					var objectQuestions = object["Questions"];
					if(Array.isArray(objectQuestions)){
						this.questions = [];
						for(var i=0; i < objectQuestions.length; i++){
							this.questions.push(new question(false));
							this.questions[i].constructFromJSON(objectQuestions[i]);
						}
					}  else {
						console.log("Questions in tracker is not an Array :-(");
					}
				} else {
					console.log("No questions in tracker object :-(");
				}
				if("TableID" in object){
					this.fusionTableID = object["TableID"];
				} else {
					console.log("No fusionTableID in tracker object :-(");
				}
			}
		};
		function project(){
			this.survey = null;
			this.tracker = null;
			this.getSurvey = function(){
				return this.survey;
			}
			this.setSurvey = function(survey){	
				this.survey = survey;
			}
			this.getTracker = function(){
				return this.tracker;
			}
			this.setTracker = function(tracker){
				this.tracker = tracker;
			}
			this.generateJSON = function(){
				var projectJSON = {};
				projectJSON["Survey"] = this.survey.generateJSON();
				projectJSON["Tracker"] = this.tracker.generateJSON();
				return projectJSON;
			}
			this.constructFromString = function(JSONprojectString){
				var projectObject = null;
				try{
					var projectObject = JSON.parse(JSONprojectString);
				}catch(e){
        			alert("JSON not parsed correctly, the input is not correct JSON :-("); //error in the above string(in this case,yes)!
        		}
        		if (!(projectObject == null)){
        			if("Survey" in projectObject){
        				this.survey = (new survey());
        				this.survey.constructFromJSON(projectObject["Survey"]);
        			} else {
        				console.log("No survey in project object :-(");
        			}
        			if("Tracker" in projectObject){
        				this.tracker = (new tracker());
        				this.tracker.constructFromJSON(projectObject["Tracker"]);
        			} else {
        				console.log("No tracker in project object :-(");
        			}
        		}
			}
		}