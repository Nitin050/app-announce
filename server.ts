import mongoose from 'mongoose';
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import { currentUser } from '../auth/src/middlewares/current-user';
import { errorHandler} from '../auth/src/middlewares/error-handler';
import { requireAuth } from '../auth/src/middlewares/require-auth';
import cookieSession from 'cookie-session';
import * as notes from './controllers/note.controller';
import * as drafts from './controllers/draft.controller';
import * as ann_pages from './controllers/ann_page.controller';

const app = express();

var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true,
    exposedHeaders: ["set-cookie"],
  }
app.use(cors(corsOptions));
  
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())

app.use(
  cookieSession({
    signed: false,
    // secure: true
  })
);
app.use(currentUser);


// mongoose.Promise = global.Promise;



app.get('/', (req, res) => {
    res.json({"message": "hello wold"});
});

// require('./app/routes/note.routes.js')(app);

// app.post('/notes', notes.create);
app.post('/create_note/:ann_pageId', requireAuth, (notes as any).create);
app.get('/notes', (notes as any).findAll);
app.post('/notes/:start/:end', (notes as any).findNotesOfAnnPage);
app.get('/notes/:noteId', (notes as any).findOne);
app.put('/notes/:noteId', requireAuth, (notes as any).update);
app.delete('/notes/:noteId', requireAuth, (notes as any).delete);

app.post('/create_draft/:ann_pageId', requireAuth, (drafts as any).create);
app.get('/drafts', (drafts as any).findAll);
app.post('/drafts/:start/:end', (drafts as any).findDraftsOfAnnPage);
app.get('/drafts/:draftId', (drafts as any).findOne);
app.put('/drafts/:draftId', requireAuth, (drafts as any).update);
app.delete('/drafts/:draftId', requireAuth, (drafts as any).delete);

app.post('/ann_pages', requireAuth, (ann_pages as any).create);
app.post('/ann_pages/findAll', requireAuth, (ann_pages as any).findAll);
app.post('/ann_pages/:url', (ann_pages as any).findOne);
app.post('/ann_pages/subscribe/:ann_pageId', (ann_pages as any).subscribe);
app.get('/ann_pages/:ann_pageId/notes', (ann_pages as any).findNotes);
app.put('/ann_pages/:ann_pageId', requireAuth, (ann_pages as any).update);
app.delete('/ann_pages/:ann_pageId', requireAuth, (ann_pages as any).delete);

app.all('*', async (req, res) => {
    return [{ message: 'route not found!!' }];
});
  
app.use(errorHandler);
  
const start = async () => {

    // if (!process.env.JWT_KEY) {
    //   throw new Error('JWT_KEY is not defined');
    // }

    try {
        await mongoose.connect('mongodb://localhost:27017/ann', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
        })
        console.log('app connected to MongoDb');
    } catch (err) {
        console.log('app NOT connected to MongoDb');
        console.error(err);
    }

    app.listen(4000, () => {
        console.log('app listening on port 4000');
    });
};

start();