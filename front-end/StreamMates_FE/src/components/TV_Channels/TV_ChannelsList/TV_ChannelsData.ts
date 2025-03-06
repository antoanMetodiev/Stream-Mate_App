import nova_tv from "./channel-images/nova_tv.jpg";
import btv from "./channel-images/btv.jpg";
import btv_action from "./channel-images/btv-action.jpg";

export const TV_ChannelsData = [
    {
        name: "Nova TV",
        videoURL: "https://thedaddy.to/embed/stream-480.php",
        posterImgURL: nova_tv,
        imgList: [
            "https://nstatic.nova.bg/public/pics/nova/production_galleries/d725eec64f5d12d2b192e3dd000b8fc8.jpg",
            "https://www.investor.bg/media/files/resized/article/1600x/d61/7ff585728f7ff82d433df8b2263b9d61-0000261668-article3.jpg",
        ],
        description: "Nova, stylized as NOVA[1] and previously marketed as NTV or Nova Television, is a Bulgarian free-to-air television network launched on 16 July 1994.[2] Nova TV, alongside the channels Kino Nova, Nova News, Nova Sport, DIEMA, Diema Family and Diema Sport are part of Nova Broadcasting Group and owned by United Group.",
    },
    {
        name: "BTV",
        videoURL: "https://thedaddy.to/embed/stream-479.php",
        posterImgURL: btv,
        imgList: [
            "https://cdn.btv.bg/media/images/600x/Feb2020/2112094041.webp",
            "https://cdn.btv.bg/media/images/600x/Feb2020/2112094040.webp",
        ],
        description: "BTV (stylised as bTV) is the first private national television channel in Bulgaria. Owned by bTV Media Group, part of Central European Media Enterprises, and commanding a 37% market share, it is reportedly the television channel with the largest viewing audience in the country.",
    },
    {
        name: "BTV Action",
        videoURL: "https://thedaddy.to/embed/stream-481.php",
        posterImgURL: btv_action,
        imgList: [
            "https://cdn.btv.bg/media/images/940x529/May2013/525206.jpg",
            "https://img.cms.bweb.bg/media/images/940x529/Aug2020/2112227786.webp",
        ],
        description: "bTV Action is a Bulgarian man-based television channel. The channel, along with sports channel RING, bTV, bTV Comedy, bTV Cinema and bTV Story are part of bTV Media Group, owned by Central European Media Enterprises (CME).",
    }
];