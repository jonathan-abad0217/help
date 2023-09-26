import {CardGroup} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {useState, useEffect} from 'react';
import PreviewCourses from './PreviewCourses';

export default function FeaturedProducts(){
	const [previews, setPreviews] = useState([])

	useEffect(() => {
		fetch(`http://localhost:4000/products/`)
		.then(res => res.json())
		.then(data => {
			console.log(data)

			// Create two empty arrays to be used to store random numbers and featured courses data
			const numbers = []
			const featured = []

			// This function generates a random number between 0 and the length of the data array(the fetched course data). It checks if the random number has already been added to the numbers array. If not, it adds the random number to the numbers array. If the random number already exists in the numbers array, it recursively call itself to generate a new numbers.
			const generateRandomNums = () => {
				let randomNum = Math.floor(Math.random() * data.length)

				if(numbers.indexOf(randomNum) === -1){
					numbers.push(randomNum)
				}else{
					generateRandomNums()
				}
			}

			// A loop is used to iterate five times (from 0 to 4). Inside the loop, the generatedRandomNums function is called to generate a random number and push it into the numbers array
			// You could also put (let i = 0; i < data.length; i++), so that its not hard coded.
			for (let i = 0; i < 3; i++){ 
				generateRandomNums()

				// For each iteration of the loop, the PreviewCourses component is rendered with the corresponding course data from the data array based on the random number. The key prop is set to the _id of the course for React's reconcilliation to track components
				featured.push(
					<PreviewCourses data={data[numbers[i]]} key={data[numbers[i]]._id} breakPoint={2}/>
				)
			}

			// After the loop finishes, the setPreviews function is called to update the state of the component with the featured array. This state update triggers a re-render, and the PreviewCourses components are displayed on the page
			setPreviews(featured)
		})
	}, [])

	return(
		<>
			<h2 className="text-center">Featured Products</h2>
			<CardGroup className="justify-content-center">
				{previews}
			</CardGroup>
		</>
	)
}