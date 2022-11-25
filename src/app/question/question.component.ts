import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { QuestionService } from '../service/question.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  [x: string]: any;
  public name :string="";
  public questionList : any =[];
  public currentQuestion: number = 0;
  public points: number = 0;
  counter = 60;
  correctAnswer:number = 0;
  inCorrectAnswer:number = 0;
  interval$:any;
  progress:string="0";
  isQuizCopleted:boolean = false;
  canComeBack: boolean = true;
  numBack:number = 0;
  goodAnsers:boolean = false;
  tip:boolean = false;

  constructor(private questionService: QuestionService) { }

  ngOnInit(): void {
    this.name =localStorage.getItem("name")!;
    this.getAllQuestions();
    this.startCounter();
  }

  getAllQuestions(){
    this.questionService.getQuestionJeson()
    .subscribe(res=>{
      this.questionList = res.questions;
    })
  }
  nextQuestion(){
    this.currentQuestion++;
  }
  previousQuestion(){
    this.currentQuestion--;
    if((this.currentQuestion+1) * 10 >= this.points ){
      this.points-=10;
      if(this.points > -10){
        this.points+=20;
      }
    }
    else{
      this.points+=10;
    }
    this.chakCnotBack();
  }
  answer(currentQuo:number, option:any){
    if(currentQuo === this.questionList.length){
      this.isQuizCopleted = true;
      this.stopCounter();
      if(this.points >= 70){
        this.goodAnsers = true;
      }
    }
    else if(option.correct){
      this.points+= 10;
      this.correctAnswer++;
      setTimeout(()=>{
        this.currentQuestion++;
        this.resetCounter();
        this.getProgressPercent();
        this.tip = false;
      },1000)
    }
    else{
      setTimeout(()=>{
        this.currentQuestion++;
        this.inCorrectAnswer++;
        this.resetCounter();
        this.getProgressPercent();
        this.tip = false;
      },1000)
      this.points-=10;
    }
  }
  startCounter(){
    this.interval$ = interval(1000)
    .subscribe(val=>{
      this.counter--;
      if(this.counter==0){
        this.currentQuestion++;
        this.counter=60;
        this.points-=10;
      }
    });
    setTimeout(()=>{
      this.interval$.unsubscribe();

    },/*finish this.questionList.lenghet*60*/600000);
  }
  stopCounter(){
    this.interval$.unsubscribe();
    this.counter=0;
  }
  resetCounter(){
    this.stopCounter();
    this.counter=60;
    this.startCounter();
    this.canComeBack = true;
  }
  resetQuiz(){
    this.resetCounter();
    this.getAllQuestions();
    this.points=0;
    this.currentQuestion=0;
    this.progress="0";
    this.numBack = 0;
  }
  getProgressPercent(){
    this.progress = ((this.currentQuestion / this.questionList.length)*100).toString();
    return this.progress;
  }
  chakCnotBack(){
    if(this.numBack >= 1){
      this.canComeBack = false;
    }
    this.numBack++;
  }
  getTip(){
    this.tip = true;
  }
}
