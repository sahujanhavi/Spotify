import React, { useEffect, useState } from "react";
import ListItem from "../components/list";
import Frame from '../assets/Frame.svg';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import logo from '../assets/Logo.svg';
import profile from '../assets/Profile.svg';

const TABS = {
    for_you: 'for_you',
    top_tracks: 'top_tracks'
}

const Homepage = () => {
    const [songsData, setSongsData] = useState([]);
    const [selectedSong, setSelectedSong] = useState({});
    const [activeTab, setActiveTab] = useState(TABS.for_you);
    const [filteredData, setFilteredData] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [showList, setShowList] = useState(true);

    // Fetch songs from API
    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await fetch('https://cms.samespace.com/items/songs');
                const data = await response.json();
                setSongsData(data.data);
                setFilteredData(data.data);
            } catch (error) {
                console.error('Error fetching songs:', error);
            }
        };

        fetchSongs();
    }, []);

    // Handle tab switching and data filtering
    useEffect(() => {
        if (!songsData) return;

        if (activeTab === TABS.top_tracks) {
            const topTracks = songsData.filter((item) => item.top_track === true);
            setFilteredData(topTracks);
        } else if (activeTab === TABS.for_you) {
            setFilteredData(songsData);
        }
    }, [activeTab, songsData]);

    // Handle song search
    useEffect(() => {
        if (!songsData) return;

        const filteredSongs = songsData.filter((song) =>
            song.name.toLowerCase().includes(searchValue) ||
            song.artist.toLowerCase().includes(searchValue)
        );
        setFilteredData(filteredSongs);
    }, [searchValue, songsData]);

    // Handle next song
    function handleNext(data) {
        const currentIndex = filteredData.findIndex((item) => item.id === data.id);
        if (currentIndex !== -1) {
            setSelectedSong(filteredData[(currentIndex + 1) % filteredData.length]);
        }
    }

    // Handle previous song
    function handlePrev(data) {
        const currentIndex = filteredData.findIndex((item) => item.id === data.id);
        if (currentIndex !== -1) {
            setSelectedSong(filteredData[(currentIndex - 1 + filteredData.length) % filteredData.length]);
        }
    }

    // Handle search input
    function handleSearch(event) {
        setSearchValue(event.target.value.toLowerCase());
    }

    return (
        <div className="homepage" style={{background: `linear-gradient(108deg, ${selectedSong.accent || '#000'}, rgba(0, 0, 0, 0.60) 99.84%), #000`}}>
            <div className="sidebar">
                <div>
                    <img src={logo} alt="logo"/>
                </div>
                <div>
                    <img src={profile} alt="profile"/>
                </div>
            </div>
            <div className="show_list" onClick={() => setShowList(!showList)}>
                {!showList ? "Show List" : "Hide List"}
            </div>
            <div className={showList ? 'middle' : 'middle display_none'}>
                <div className="topbar">
                    <div onClick={() => setActiveTab(TABS.for_you)} className={`for_you ${activeTab === TABS.for_you ? '' : 'not_selected'}`}>
                        For You
                    </div>
                    <div onClick={() => setActiveTab(TABS.top_tracks)} className={`top_tracks ${activeTab === TABS.top_tracks ? '' : 'not_selected'}`}>
                        Top Tracks
                    </div>
                </div>
                <div className="search_bar">
                    <input placeholder="Search Song, Artist" onChange={handleSearch}/>
                    <img src={Frame} alt="search"/>
                </div>
                <div className="list_item_container">
                    {filteredData?.map((item, index) => (
                        <ListItem
                            icon={item.cover}
                            artist={item.artist}
                            name={item.name}
                            data={item}
                            selectedSong={selectedSong}
                            setSelectedSong={(value) => setSelectedSong(value)}
                            key={index}
                        />
                    ))}
                </div>
            </div>
            {selectedSong && Object.keys(selectedSong).length > 0 &&
            <div className={showList ? "media-player display_none" : "media-player"}>
                <div className="played_songs_details">
                    <div className="song_played">{selectedSong.name}</div>
                    <div className="artist_played">{selectedSong.artist}</div>
                </div>
                <div className="cover_art_container">
                   <img src={`https://cms.samespace.com/assets/${selectedSong.cover}`} alt="cover" className="cover_art"/>
                </div>
                <AudioPlayer
                    autoPlay
                    src={selectedSong.url}
                    showDownloadProgress={false}
                    showSkipControls={true}
                    showJumpControls={false}
                    onClickNext={() => handleNext(selectedSong)}
                    onClickPrevious={() => handlePrev(selectedSong)}
                    onEnded={() => handleNext(selectedSong)}
                />
            </div>}
        </div>
    );
}

export default Homepage;
