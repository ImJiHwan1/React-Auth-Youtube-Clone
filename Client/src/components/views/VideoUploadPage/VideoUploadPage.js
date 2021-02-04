import React, { useState } from 'react'
import { Typography, Button, Form, message, Input, Icon } from 'antd'
import Dropzone from 'react-dropzone'
import Axios from 'axios';
import { useSelector } from 'react-redux'

const { Title } = Typography;
const { TextArea } = Input;

const PrivateOptions = [
    { value: 0, label: "Private" },
    { value: 1, label: "Public" },
]

const CategoryOptions = [
    { value: 0, label: "Film & Animation"},
    { value: 1, label: "Autos & Vehicles"},
    { value: 2, label: "Music"},
    { value: 3, label: "Pets & Animals"},
]

function VideoUploadPage(props) {

    const user = useSelector(state => state.user)
    const [VideoTitle, setVideoTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Private, setPrivate] = useState(0)
    const [Category, setCategory] = useState("Film & Animation")
    const [FilePath, setFilePath] = useState("")
    const [Duration, setDuration] = useState("")
    const [ThumbnaulPath, setThumbnaulPath] = useState("")

    const onTitleChange = (e) => {
        setVideoTitle(e.currentTarget.value)
    }

    const onDescriptionChange = (e) => {
        setDescription(e.currentTarget.value)
    }

    const onPrivateChange = (e) => {
        setPrivate(e.currentTarget.value)
    }

    const onCategoryChange = (e) => {
        setCategory(e.currentTarget.value)
    }

    const onDrop = (files) => {
        // 서버에다 request 할때 추가 content-type setting
        let formData = new FormData;
        const config = {
            header: {'content-type': 'multipart/form-data'}
        }
        formData.append("file", files[0])

        // console.log(files)
        Axios.post('/api/video/uploadfiles', formData, config)
            .then(response => {
                if(response.data.success) {
                    // console.log(response.data)

                    let variable = {
                        url: response.data.url,
                        fileName: response.data.fileName
                    }
                    
                    setFilePath(response.data.url)

                    Axios.post('/api/video/thumbnail', variable)
                        .then(response => {
                            if(response.data.success) {
                                // console.log(response.data)
                                setDuration(response.data.fileDuration)
                                setThumbnaulPath(response.data.url)
                            } else {
                                alert('썸네일 생성에 실패 했습니다.')
                            }
                        })
                        } else {
                            alert('비디오 업로드를 실패했습니다.')
                            }
            })
    }

    const onSumit = (e) => {
        e.preventDefault();

        const variable = {
            writer: user.userData._id,
            title: VideoTitle,
            description: Description,
            privacy: Private,
            filePath: FilePath,
            category: Category,
            duration: Duration,
            thumbnail: ThumbnaulPath,
        }

        Axios.post('/api/video/uploadVideo', variable)
            .then(response => {
                if(response.data.success) {
                    message.success('업로드 성공')
                    setTimeout(() => {
                        props.history.push('/')
                    }, 3000)
                } else {
                    alert('비디오 업로드에 실패 했습니다.')
                }
            })
    }

    return (
        <div style={{ maxWidth:'700px', margin:'2rem auto' }}>
            <div style={{ textAlign:'center', marginBottom:'2rem' }}>
                    <Title level={2}> 비디오 업로드 </Title>
            </div>

            <Form onSubmit={onSumit}>
                    <div style={{ display:'flex', justifyContent:'space-between' }}>
                            {/* Drop zone */}
                            <Dropzone
                                onDrop={onDrop}
                                multiple={false}
                                maxSize={1000000000000000000000}>
                                 {({ getRootProps, getInputProps }) => (
                                     <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display:'flex',
                                                            alignItems: 'center', justifyContent: 'center' }} {...getRootProps()}>
                                            <input {...getInputProps()} />
                                            <Icon type="plus" style={{ fontsize: '3rem' }} />
                                    </div>
                                 )}     
                                </Dropzone>
                            {/* Thumb zone */}
                            {ThumbnaulPath &&
                            <div>
                                    <img src={`http://localhost:5000/${ThumbnaulPath}`} alt="thumbnail" />
                            </div>
                            }
                    </div>
            <br/>
            <br/>
            <label>제목</label>
            <Input
                    onChange={onTitleChange}
                    value={VideoTitle}
            />
            <br/>
            <br/>
            <label>설명</label>
            <TextArea
                    onChange={onDescriptionChange}
                    value={Description}
            />
            <select onChange={onPrivateChange}>
                {PrivateOptions.map((item, index) => (
                    <option key={index} value={item.value}>{item.label}</option>
                ))}
            </select>
            <br/>
            <br/>
            <select onChange={onCategoryChange}>
                {CategoryOptions.map((item, index) => (
                    <option key={index} value={item.value}>{item.label}</option>
                ))}
            </select>
            <br/>
            <br/>
            <Button type="primary" size="large" onClick={onSumit}>
                    업로드
            </Button>
            </Form>
        </div>
    )

}
export default VideoUploadPage