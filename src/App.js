import './App.css';
import { useState,useEffect } from 'react';
import {AppBar,Box,Toolbar,Typography,CircularProgress} from '@material-ui/core';
import axios from 'axios'
import FilterBar from './FilterBar';
import SubjectMain from './SubjectMain';

function App() {

  const [subjects,setsubjects]=useState(null);
  const [parents,setparents]=useState(null);
  const [filters,setFilters]=useState(null);
  const [passingsubjects,setPassingSubjects]=useState(null);
  
  function convert(str) {
    var newDate = new Date(str),
      mnth = ("0" + (newDate.getMonth() + 1)).slice(-2),
      day = ("0" + newDate.getDate()).slice(-2);
    return [newDate.getFullYear(), mnth, day].join("-");
  }

  
   let temp=new Set();
  function filter(t){
    const n=convert(t.date);
    t.date=n;
    console.log(t.date);
    setFilters(t);
  }
  useEffect(()=>{
    axios.get('https://nut-case.s3.amazonaws.com/coursessc.json')
   .then((response)=>{
    setPassingSubjects(response.data.slice(0,500));
     setsubjects(response.data.slice(0,500));
     
    response.data.map(item => temp.add(item['Parent Subject']));
    const x=Array.from(temp);
    
    setparents(x);
    
   })
   
 },[]);
 useEffect(()=>{
   
  if(filters){
    if(filters.selfPaced){
    const x=subjects.filter(item=>item['Parent Subject']==filters.course && item['Child Subject']==filters.childcourse && (filters.selfPaced && item['Next Session Date']=='Self paced'));
    console.log("value of x");
    console.log(x);
    setPassingSubjects(x);
  }
    else

    {   const x=subjects.filter(item=>{
      var filteDateString = item['Next Session Date']
      var replacedDate = filteDateString.replace('nd','').replace('rd','').replace('th','').replace('st','')
      var filterDate = new Date(replacedDate);
      const stringDate = convert(filterDate);
     console.log(stringDate);
      if(stringDate==filters.date && item['Parent Subject']==filters.course && item['Child Subject']==filters.childcourse){
      
        return true;}
    })
    console.log(x);
      setPassingSubjects(x);
    }
  }
  else
    setPassingSubjects(subjects);
 },[filters])
 
 

  return (
    <div style={{padding:'1% 2%'}} className='App'>
       <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" className='TitleBar' style={{background:'#1A8DE1'}}>
        <Toolbar style={{display:'flex',justifyContent:'space-between'}}>
         
          <Typography variant="h4" component="div" style={{fontWeight:'700',fontFamily:'Montserrat, sans-serif',color:'#ffffff '}}>
            Course Finder
          </Typography>
          
          <Typography variant='subtitle1' component="div" style={{fontWeight:'600',fontFamily:'Montserrat, sans-serif',color:'#ffffff'}}>Courses found:
          <span style={{color:'#C7EBF5 '}}>500</span>
          </Typography>
         
         
          
        </Toolbar>
      </AppBar>
    </Box>

   { subjects?<FilterBar parents={parents} subjects={subjects} filter={filter}/>:null}
   {subjects ?<SubjectMain subjects={passingsubjects} filter={filters}/>:<CircularProgress  style={{positon:'absolute',top:'50%',left:'50%'}}/>}
  
    </div>
  );
}

export default App;
