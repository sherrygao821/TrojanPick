// TODO:
// 1. modal: 最大字数限制，字体等，取消/确定button功能不同，失焦事件

Page({
  data: {
    evaluateTitle:['课程难度', '内容趣味性', 'workload', 'teaching'],
    stars:[0, 1, 2, 3, 4],
    unselectedSrc: "/icon/others/rate-star.svg",
    selectedSrc: "/icon/others/favorite.svg",
    score: 0,
    scores: [0, 0, 0, 0],
    gradeIndex: 0,
    gradeArray: [' ', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'P', 'F', 'IP'],
    showModal: false,

    grade: " ",
    courseCode: "",
    courseID: "",
    classCode: "",
    professorName: "",
    professorID: "",
    anonymous: false,
    content: "",
    commentCount: 0,
    up_vote_count: 0,
    down_vote_count: 0,
    favoriteCount: 0,
    course_data: [],
    professor_data: [],
    show_course: false, // 是否显示下拉框
    show_prof: false,
    correctCourse: false, // 判断user是否选择了正确的课程
    correctProfessor: false,
    course_blurred: false, // 判断input框是否失焦
    prof_blurred: false,
  },

  // input搜索节流var
  course_timer: -1,
  prof_timer: -1,

  // course input失焦时下拉框消失
  bindBlurCourse(e){
    this.setData({
      show_course: false,
      course_blurred: true
    })
  },

  // professor input失焦时下拉框消失
  bindBlurProf(e){
    this.setData({
      show_prof: false,
      prof_blurred: true
    })
  },

  // user没有input或输入courseCode查找不到
  loadEmptyCourse(){
    this.setData({
      course_data: [],
      show_course: false,
      correctCourse: false
    })
  },

  // user没有input或输入professorName查找不到
  loadEmptyProf(){
    this.setData({
      professor_data: [],
      show_prof: false,
      correctProfessor: false
    })
  },

  // 保存输入courseCode & 从数据库找课程信息
  saveCourseCode(e){
    if(e.detail.value === ""){
      this.loadEmptyCourse()
    }
    else{
      this.setData({
        courseCode: e.detail.value,
        course_blurred: false
      })
      // setTimeout不可以直接传参数
      this.course_timer = setTimeout(this.searchCourse,1000)
    }
  },

  /*
  bindTapCourse: function(){
    this.setData({
      course_blurred: false
    })
  },
  */

  // search in the database for courseCode
  searchCourse: function(){
    if(!this.data.course_blurred){
      wx.cloud.callFunction({
        name: "getRelatedInfo",
        data: {
          target: "courses",
          courseCode: this.data.courseCode
        },
        success: (res)=>{
          this.setData({
            course_data: res.result.data,
          })
          if(res.result.data[0] === undefined){
            this.loadEmptyCourse()
          }
          else{
            this.setData({
              show_course: true,
            })
            // user自己输入了完全正确的courseCode
            if(res.result.data[0].courseCode === this.data.courseCode){
              this.setData({
                correctCourse: true,
                courseID: this.data.course_data[0]._id,
                show_course: false
              })
            }
          }
        },
        fail: err=>{
          console.log(err)
        }
      })
    }
 },

  // 点击选择课程
  selectCourse: function(e){
    this.setData({
      courseCode: this.data.course_data[e.currentTarget.dataset.index].courseCode,
      courseID: this.data.course_data[e.currentTarget.dataset.index]._id,
      show_course: false,
      correctCourse: true
    });
  },

  // 保存输入professorName & 从数据库找教授信息
  saveProfName(e){
    if(e.detail.value === ""){
      this.loadEmptyProf()
    }
    else{
      this.setData({
        professorName: e.detail.value,
        prof_blurred: false
      })
      // setTimeout不可以直接传参数
      this.prof_timer = setTimeout(this.searchProfessor,1000)
    }
  },

  // search in the database for professorName
  searchProfessor: function(){
    if(!this.data.prof_blurred){
      wx.cloud.callFunction({
        name: "getRelatedInfo",
        data: {
          target: "professors",
          professorName: this.data.professorName
        },
        success: (res)=>{
          this.setData({
            professor_data: res.result.data
          })
          if(res.result.data[0] === undefined){
            this.loadEmptyProf()
          }
          else{
            this.setData({
              show_prof: true,
            })
            // user自己输入了完全正确的professorName
            if(res.result.data[0].professorName === this.data.professorName){
              this.setData({
                correctProfessor: true,
                professorID: this.data.professor_data[0]._id,
                show_prof: false
              })
            }
          }
        },
        fail: err=>{
          console.log(err)
        }
      })
    }
 },

  // 点击选择professor
  selectProfessor: function(e){
    this.setData({
      professorID: this.data.professor_data[e.currentTarget.dataset.index]._id,
      professorName: this.data.professor_data[e.currentTarget.dataset.index].professorName,
      show_prof: false,
      correctProfessor: true
    })
  },

  // 保存评价
  saveContent(e){
    this.setData({
      content: e.detail.value
    })
  },

  // 选择成绩
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      gradeIndex: e.detail.value,
    })
    console.log("成功填写成绩为 ", this.data.gradeArray[this.data.gradeIndex])
  },
  
  // 选择星星
  selectStar: function(e){
    var score = e.currentTarget.dataset.score
    this.data.scores[e.currentTarget.dataset.idx] = score
    this.setData({
      scores: this.data.scores,
      score: score
    })
    console.log("成功填写评分为 ", this.data.scores)
  },

  // 选择匿名
  changeAnonymous:function(e){
    this.setData({
      anonymous: e.detail.value
    })
    console.log("checkbox选择改变，携带值为", this.data.anonymous)
  },

  // 提交问题
  submitQuestion:function(e){
    if(this.data.courseCode.trim() === "" || this.data.professorName.trim() === "" || this.data.content.trim() === ""){
      wx.showToast({
        icon: 'none',
        title: '未填写完成'
      })
      return false;
    }
    else if(!this.data.correctCourse){
      wx.showToast({
        icon: 'none',
        title: '请填写有效课程'
      })
      return false;
    }
    else if(!this.data.correctProfessor){
      wx.showToast({
        icon: 'none',
        title: '请填写有效教授'
      })
      return false;
    }
    wx.cloud.callFunction({
      name: "createReview",
      data: {
        courseID: this.data.courseID,
        professorID: this.data.professorID,
        difficultyRating: this.data.scores[0],
        interestingRating: this.data.scores[1],
        workloadRating: this.data.scores[2],
        teachingRating: this.data.scores[3],
        grade: this.data.gradeArray[this.data.gradeIndex],
        anonymous: this.data.anonymous,
        content: this.data.content,
        commentCount: this.data.commentCount,
        up_vote_count: this.data.up_vote_count,
        down_vote_count: this.data.down_vote_count,
        favoriteCount: this.data.favoriteCount
      },

      sucess: res=>{
        console.log("提交Review成功", res.data),
        wx.showToast({
          icon: "success",
          title: "提交成功"
        })
        /*
        setTimeout(function(){
          //要延时执行的代码
          wx.navigateBack({
            delta: 1,
          })
         }, 2000) //延迟时间 这里是2秒
         */

      },
      fail: err=>{
        console.log("提交Review失败", err)
      }
    })
  },

  showDialogBtn: function() {
    this.setData({
      showModal: true
    })
  },

  preventTouchMove: function () {
  },

  hideModal: function () {
    this.setData({
      showModal: false
    });
  },

  onCancel: function () {
    this.hideModal();
  },

  onConfirm: function () {
    this.hideModal();
  },

})