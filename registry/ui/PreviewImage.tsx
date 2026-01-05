"use client"

import type { PreviewImageProps } from "lpm/types/ui/PreviewImage"
import { useEffect, useState } from "react"
import MyImage from "./Image"

export default function PreviewImage({ file, doUpload }: PreviewImageProps) {
	const [image, setImage] = useState("")

	useEffect(() => {
		const url = URL.createObjectURL(file)
		setImage(url)
		if (doUpload) doUpload(file)

		return () => {
			URL.revokeObjectURL(url)
		}
	}, [file, doUpload])

	return <div>{image && <MyImage url={image} title={file.name} />}</div>
}
