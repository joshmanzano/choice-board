import React from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, addDoc, setDoc, getDocs, getDoc } from 'firebase/firestore';
import { Container, Grid, Space, Anchor, Center, Input, Button, Title, Divider, LoadingOverlay} from '@mantine/core';
import './App.css';
import axios from 'axios';
import MovieCard from './MovieCard';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHcnygt0kI4igHCCxOgNSF_mvkrBbVbrk",
  authDomain: "moviepicker-2a4e3.firebaseapp.com",
  projectId: "moviepicker-2a4e3",
  storageBucket: "moviepicker-2a4e3.appspot.com",
  messagingSenderId: "937617524701",
  appId: "1:937617524701:web:9b0b1a1c28653e4ee55834"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const img_url = 'https://www.themoviedb.org/t/p/w440_and_h660_face/';


function App() {
  // React.useEffect(() => {
  //   axios.get('https://api.themoviedb.org/3/movie/popular?api_key=b8ec09033f0e2d47aafc15b9aa09e519&language=en-US&page=1').then((response) => {
  //     console.log(response)
  //   });
  // }, []);
  function requestMovieDetails(id:string){
    setLoading(true);
    const details_url = 'https://api.themoviedb.org/3/movie/'+id+'?api_key=b8ec09033f0e2d47aafc15b9aa09e519&language=en-US'
    const video_url = 'https://api.themoviedb.org/3/movie/'+id+'/videos?api_key=b8ec09033f0e2d47aafc15b9aa09e519&language=en-US'
    const movie:any[] = []
    axios.get(details_url).then((response:any) => {
      movie[0] = response.data.title;
      movie[1] = response.data.genres;
      movie[2] = []; 
      movie[3] = response.data.overview;
      movie[4] = 'https://www.themoviedb.org/t/p/w1280/'+response.data.poster_path
      axios.get(video_url).then((response:any) => {
        response.data.results.forEach((video:any) => {
          movie[2].push('https://www.youtube.com/watch?v='+video.key);
        })
        addMovie(id, movie[0], movie[1], movie[2], movie[3], movie[4]);
      });
    }).catch(() => {
      setLoading(false);
    });

  }

  const [loading, setLoading] = React.useState(true);
  const [movies, setMovies] = React.useState([[]]);
  const [order, setOrder] = React.useState([[]]);
  const [choices, setChoices] = React.useState([[]]);
  const [selectAmount, setSelectAmount] = React.useState(3);
  const [mode, setMode] = React.useState("Pick");
  const [text, setText] = React.useState("");
  const [loaded, setLoaded] = React.useState(false);
  const debug = false;


  const re = /[0-9]+/;

  async function addMovie(id:string, name:string, genre:any[], trailer:string[], summary:string, img:string){
    try{
      const docRef = await setDoc(doc(db, 'movies', id), {
        id: id,
        name: name,
        genre: genre,
        trailer: trailer,
        summary: summary,
        img: img,
        picked: false,
        removed: false,
      }).then(() => {
        window.location.reload();
      });
    } catch (e){
      setLoading(false);
      console.error('Error add');
    }
  }

  async function setMovie(id:string){
    setLoading(true);
    try{
        const docRef = doc(db, 'movies', id);
        if(mode == 'Pick'){
          await setDoc(docRef, {
            picked: true,
          }, {merge:true}).then(() => { window.location.reload() });
        }else if(mode == 'Remove'){
          await setDoc(docRef, {
            removed: true,
          }, {merge:true}).then(() => { window.location.reload() });
        }
    } catch (e){
      setLoading(false);
      console.error('Error add');
    }
  }

  async function unSetMovie(id:string, reload:boolean=true){
    setLoading(true);
    try{
        const docRef = doc(db, 'movies', id);
        if(mode == 'Pick'){
          await setDoc(docRef, {
            removed: false,
            picked: false,
          }, {merge:true}).then(() => { if(reload) {window.location.reload()} });
        }
    } catch (e){
      setLoading(false);
      console.error('Error add');
    }
  }

  const movieInput = 
        <Grid>
          <Grid.Col xs={4}>
            <Center>
              <Anchor target="_blank" href={'https://www.themoviedb.org/'}>
                themoviedb.org
              </Anchor>
            </Center>
          </Grid.Col>
          <Grid.Col xs={4}>
            <Input onChange={(evt:any) => setText(evt.target.value)} placeholder='https://www.themoviedb.org/movie/299536-avengers-infinity-war'/>
          </Grid.Col>
          <Grid.Col xs={4}>
            <Center>
              <Button onClick={() => {
                if(text != ''){
                  const matched_text = re.exec(text);
                  if(matched_text != null){
                    let movie_id:string = matched_text[0]; 
                    requestMovieDetails(movie_id);
                    setText('');
                  }
                }
              }}>
                Submit
              </Button>
            </Center>
          </Grid.Col>
        </Grid>;

  React.useEffect(() => {
    async function execute(){
      const array_movies:any[] = [];
      const settings = await getDocs(collection(db, 'settings'));
      const movies = await getDocs(collection(db, 'movies'));
      movies.forEach((movie) => {
        array_movies.push(
          [movie.data().name,
          movie.data().genre,
          movie.data().trailer,
          movie.data().summary,
          movie.data().img,
          movie.data().picked,
          movie.data().removed,
          movie.data().id]
        )
        if(debug){
          unSetMovie(movie.data().id, false);
        }
      });
      settings.forEach((setting) => {
        if(!debug){
          setMode(setting.data().mode)
          setSelectAmount(setting.data().selectAmount)
        }
      });
      const people_order = await getDoc(doc(db, 'people', 'order'));
      if(people_order.exists()){
        setOrder(people_order.data().order);
      }
      setMovies(array_movies);
      setLoaded(true);
      setLoading(false);
    }
    execute();
  }, []);

  React.useEffect(() => {
    console.log(movies);
    console.log(mode);
  }, [movies, mode]);

  return (
    <React.Fragment>
    <LoadingOverlay visible={loading} />
    {loaded ?
    <Container my="md">
      {selectAmount > 0 ?
      <React.Fragment>
        {mode == 'Idle' ? 
          movieInput
        :
        <React.Fragment>
        <Center>
          <Title order={1}>
            {mode} {selectAmount} movie{selectAmount > 1 ? 's' : ''}
          </Title>
        </Center>
        <Center>
          <Title order={1}>
            {order}
          </Title>
        </Center>
        </React.Fragment>
        }
      </React.Fragment>
      : null
      }
      <Space h='lg'/>
      {movies.length > 0 ?
      <Grid>
        {movies.map((movie) => {
            if(movie.length > 0){
              return (
                <React.Fragment>
                  {mode != 'Remove' || (movie[5] && !movie[6]) ?
                    <Grid.Col xs={4}>
                      <MovieCard name={movie[0]} genre={movie[1]} trailer={movie[2]} summary={movie[3]} img={movie[4]} mode={mode} status={mode == 'Pick' ? movie[5] : movie[6]} setMovie={setMovie} unSetMovie={unSetMovie} id={movie[7]}/>
                    </Grid.Col>
                  : null
                  }
                </React.Fragment>
              )
            }
          })
        }
      </Grid>
      :
      <Center>
        No movies.
      </Center>
      }
      <Space h='lg'/>
      <Divider my='sm'/>
      <Space h='lg'/>
      <Center>
        <Title order={2}>
          Enter movies here (paste moviedb.org links):
        </Title>
      </Center>
      <Space h='lg'/>
      {movieInput}
    </Container>
    : null}
    </React.Fragment>
  );
}

export default App;
