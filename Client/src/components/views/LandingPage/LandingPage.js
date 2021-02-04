import React, { useEffect, useState } from 'react'
import { Typography, Row, Col, Card, Avatar } from 'antd'
import Axios from 'axios';
import moment from 'moment'

const { Title } = Typography;
const { Meta } = Card;

function LandingPage() {

    const [Video, setVideo] = useState([])

    // useEffect는 React Dom이 실행될때 최초로 실행되는 함수이다.
    useEffect(() => {
        Axios.get('/api/video/getVideos')
            .then(response => {
                if(response.data.success) {
                    // console.log(response.data)
                    setVideo(response.data.videos)
                } else {
                    alert('비디오 가져오기 실패')
                }
            })
    }, [])

    const renderCards = Video.map((video, index) => {

        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor((video.duration - minutes * 60));

        return <Col lg={6} md={12} xs={24}>
            <div style={{ position: 'relative' }}>
                <a href={`/video/${video._id}`} >
                    <img style={{ width: '100%' }} src={`http://localhost:5000/${video.thumbnail}`} alt="thumbnails"></img>
                    <div className="duration">
                            <span>{minutes} : {seconds}</span>
                    </div>
                </a>
            </div><br />
        <Meta
               avatar={ 
                <Avatar src={require('../LandingPage/p1.jpg')} />
                }
                title={video.title}
                description=""
         />
        <span>{video.writer.name} </span><br />
        <span style={{ marginLeft: '3rem' }}>{video.views} views</span> - <span>{moment(video.createdAt).format("MMM Do YY")}</span>
    </Col>
    })

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <Title level={2}> 추천 영상 </Title>
                <hr />
                <Row gutter={[32, 16]}>
                    {/* Col은 사이즈별 칼럼갯수를 지정할수있다. */}
                    {renderCards}
            </Row>
        </div>
    )
}

export default LandingPage