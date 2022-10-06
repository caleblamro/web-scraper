const puppeteer = require("puppeteer");

async function getVideoInfo(page, link){
    await page.goto(link);
    const like_count = await page.evaluate(() => {
        return document.querySelector("[data-e2e='like-count']").textContent;
    });
    const comment_count = await page.evaluate(() => {
        return document.querySelector("[data-e2e='comment-count']").textContent;
    });
    const share_count = await page.evaluate(() => {
        return document.querySelector("[data-e2e='share-count']").textContent;
    });
    return {like_count, comment_count, share_count};
}
async function createUserData(page, userURL){
    await page.goto(userURL);
    const user_name = await page.evaluate(() => {
        return document.querySelector("[data-e2e='user-title']").textContent;
    });
    const user_following = await page.evaluate(() => {
        return document.querySelector("[data-e2e='following-count']").textContent;
    });
    const user_followers = await page.evaluate(() => {
        return document.querySelector("[data-e2e='followers-count']").textContent;
    });
    const user_videos = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("[data-e2e='user-post-item'] > div > div > a")).map(x => x.href);
    });
    /*
    const video_views = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("[data-e2e='video-views']")).map(x => x.textContent);
    });
    */
    const user = {
        name: user_name,
        following_count: user_following,
        followers_count: user_followers,
        video_links: user_videos,
        video_data: [],
    };
    return user;
}

async function main(){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    console.info("------STARTING ANALYSIS------");
    const userURL = 'https://www.tiktok.com/@charlidamelio';
    console.info("------GETTING USER DATA------");
    const userData = await createUserData(page, userURL);
    console.log(userData.name);
    console.log("\t# OF FOLLOWERS: " + userData.followers_count);
    console.log("\t# FOLLOWING: " + userData.following_count);
    console.log("USER VIDEOS: ");
    //only loop through constant number of videos to avoid errors
    console.info("------GETTING SAMPLE VIDEO DATA------");
    for(i = 0; i < userData.video_links.length; i++){
        console.log("\t\t" + (i+1) + " : " + userData.video_links[i]);
        const videoData = await getVideoInfo(page, userData.video_links[i]);
        userData.video_data[i] = videoData;
        console.log("\t\t\tLIKES: " + videoData.like_count);
        console.log("\t\t\tCOMMENTS: " + videoData.comment_count);
        console.log("\t\t\tSHARES: " + videoData.share_count);
    }
    console.info("------COMPLETED------");
    await browser.close();
}

main();