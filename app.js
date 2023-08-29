import express from "express"
import "./utils/env.js"
import session from "express-session";
import fileUpload from "express-fileupload";
import {decrypt} from "./utils/crypto.js"
import {logger} from "./utils/logger.js";

//---------------------------------------------------------------------------------------------------------------------------------------

const app = express();
const PORT = process.env.PORT ;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/upload", express.static("upload"));
//---------------------------------------------------------------------------------------------------------------------------------------
app.use(
    session({
        secret: process.env.SessionKey,
        resave: false,
        saveUninitialized: true,
        // cookie:({
        //     secure:true
        // })
    })
)
app.use(fileUpload({
    //safeFileNames:true,//Dosya adındaki boşlukları ve noktaları siler uzantıda bozulur alttaki korur
    //preserveExtension:(4||3)//uzantıyı korur
    //useTempFiles:true 

}))



//---------------------------------------------------------------------------------------------------------------------------------------
import pages from "./router/pages.js";
//---------------------------------------------------------------------------------------------------------------------------------------
app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.decrypt=decrypt
    next()
});
app.use("/", pages);
app.use("/login", pages)


app.use((err, req, res, next) => {

	logger.error(`${req.method} ${req.url} - ${err.message}`, {
		timestamp: new Date(),
		stack: err.stack,
	});

	res.status(500).send('Bir hata meydana geldi!')

	//next()
})




app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} da çalışıyor`)
});