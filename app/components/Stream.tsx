"use client";
import { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown, Share2, Play } from "lucide-react"
import { AppBar } from '../components/AppBar';
import { ImSpinner2 } from "react-icons/im";
import { useToast } from '@/hooks/use-toast';

interface VideoInterface {
    id: string,
    title: string,
    votes: number,
    smallImg: string,
    bigImg: string,
    extractedId:string,
    haveUpvoted:boolean
}
const INTERVAL_TIME = 1000 * 10;
export default function Stream({CREATOR_ID , playVideo = false}:{CREATOR_ID : string , playVideo : boolean}) {

    const { toast } = useToast()
    const [videoLink, setVideoLink] = useState("")
    const [queue, setQueue] = useState<VideoInterface[]>([])
    const [currentVideo, setCurrentVideo] = useState<VideoInterface>()
    const [loading , setLoading] = useState(false);
    // const videPlayerRef = useRef();

    async function getQueue() {
        const response = await fetch(`/api/streams?creatorId=${CREATOR_ID}`,{
            method:"GET"
        });
        const data = await response.json();
        setQueue(data.streams);
        if(!data?.activeStream?.played) setCurrentVideo(data?.activeStream?.stream);
    }

    useEffect(() => {
        getQueue();
        setInterval(getQueue,INTERVAL_TIME);
    }, [])

    // useEffect(() => {
    //     if (!videPlayerRef.current) return;
    //     let player = YouTubePlayer(videPlayerRef.current);
    //     if (currentVideo) {
    //         player.loadVideoById(currentVideo.extractedId);
    //         player.playVideo();
    //     }
    //     try{
    //         console.log(currentVideo?.extractedId);
    //         const onPlayerStateChange = async (event:any) => {
    //             if (event.data === 0) { 
    //                 await handlePlayNext();
    //             }
    //         };
    //         let listener = player.on('stateChange', onPlayerStateChange);
    //     }catch(erro){
    //         console.log(erro)
    //     }
    // }, [currentVideo, videPlayerRef]);

    const handleSubmit = async (e: React.FormEvent) => {
        setLoading(true);
        e.preventDefault()
        const res = await fetch("/api/streams",{
            method : "POST",
            body : JSON.stringify({
                creatorId: CREATOR_ID,
                url: videoLink
            })
        })
        const data = await res.json();
        setQueue([...queue,data]);
        setLoading(false);
        setVideoLink("")
    }
    const handleVote = async (id: string, increment: number) => {
        setQueue(queue.map(item =>
            item.id === id ? { ...item, 
                votes: item.votes + increment,
                haveUpvoted: !item.haveUpvoted
            } : item
        ).sort((a, b) => b.votes - a.votes))
        const vote = (increment === 1) ? "upvote":"downvote";
        await fetch(`/api/streams/${vote}/`,{
            method:"POST",
            body:JSON.stringify({streamId:id})
        })
    }
    const handlePlayNext = async () => {
        const data = await fetch(`/api/streams/playNext`,{
            method : "GET"
        })
        const streamData = await data.json();
        if(streamData.stream){
            if(!streamData.stream?.played) setCurrentVideo(streamData.stream);
            setQueue(()=>queue.filter(obj => obj.id != streamData.stream.id))
        }
    }
    const handleShare = () => {
        const shareUrl = `${window.location.hostname}/creator/${CREATOR_ID}`
        navigator.clipboard.writeText(shareUrl).then(() => {
            toast({
                title: "URL Copied",
                description: "The URL has been copied to your clipboard!",
            });
        }).catch(err => {
            toast({
                variant:"destructive",
                title: "Failed to Copy",
                description: "There was an error copying the URL.",
            });
        });
    
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
            <AppBar/>
            <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-4">
                    <Card className="bg-gray-800/80 backdrop-blur-sm border border-purple-500">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-purple-300">Upcoming Songs</h2>
                                <Button onClick={handleShare} variant="outline" className="bg-purple-700 text-purple-100 hover:bg-purple-600">
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Share Queue
                                </Button>
                            </div>
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                                {queue && queue.map((song) => (
                                    <div key={song.id} className="flex items-center space-x-4 bg-gray-700/50 p-2 rounded-md">
                                        <img src={song.smallImg} alt={song.title} className="w-16 h-16 object-cover rounded-md" />
                                        <div className="flex-grow">
                                            <h3 className="font-semibold text-purple-200">{song.title}</h3>
                                            <p className="text-gray-300">Votes: {song.votes}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            {!song.haveUpvoted && <Button size="sm" variant="outline" onClick={() => handleVote(song.id, 1)}
                                                className="bg-purple-700 text-purple-100 hover:bg-purple-600 border-purple-500">
                                                <ThumbsUp className="w-4 h-4" />
                                            </Button>}
                                            {song.haveUpvoted && <Button size="sm" variant="outline" onClick={() => handleVote(song.id, -1)}
                                                className="bg-gray-700 text-gray-100 hover:bg-gray-600 border-gray-500">
                                                <ThumbsDown className="w-4 h-4" />
                                            </Button>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-800/80 backdrop-blur-sm border border-purple-500">
                        <CardContent className="p-4">
                            <h2 className="text-2xl font-bold mb-4 text-purple-300">Add a Song</h2>
                            <form onSubmit={handleSubmit} className="space-y-2">
                                <Input
                                    type="text"
                                    placeholder="Paste YouTube video link here"
                                    value={videoLink}
                                    onChange={(e) => setVideoLink(e.target.value)}
                                    className="bg-gray-700 text-gray-100 border-gray-600 placeholder-gray-400"
                                />
                                {!loading &&<Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold">
                                    Add to Queue
                                </Button>}
                                {loading && <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold">
                                    <ImSpinner2 className="animate-spin"></ImSpinner2>
                                </Button>}
                            </form>
                            {videoLink && (
                                <div className="mt-4">
                                    <h3 className="font-semibold mb-2 text-purple-300">Preview:</h3>
                                    <img
                                        src={`https://img.youtube.com/vi/${videoLink.split('v=')[1]}/0.jpg`}
                                        alt="Video smallImg"
                                        className="w-full rounded-md"
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card className="bg-gray-800/80 backdrop-blur-sm border border-purple-500">
                    <CardContent className="p-4">
                        <h2 className="text-2xl font-bold mb-4 text-purple-300">Current Song</h2>
                        <div className="aspect-video bg-gray-700/50 rounded-md overflow-hidden">
                            {playVideo ? <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${currentVideo?.extractedId}?autoplay=1`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="border-0"
                            ></iframe>
                            :
                            <img src={`${currentVideo?.bigImg}`}
                                width="100%"
                                height="100%"
                            ></img>
                            }
                        </div>
                        {playVideo && <Button className="w-full h-full bg-purple-600 hover:bg-purple-700 text-white font-semibold mt-10" onClick={()=>handlePlayNext()}>
                            <Play className='p-2'/>Play Next
                        </Button>}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}