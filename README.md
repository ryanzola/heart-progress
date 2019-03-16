# Heart/EKG Progress Bar

## The run down...
For this demo (and most of my demos), I've come to really enjoy the quickness and ease of spinning up a project with Parcel. IT. JUST. WORKS. If you want to use some css preprocessors like sass or scss, you just create a sass or scss file and add it to your index. The same with typescript, which Ive come to really love for these little projects as it keeps my code a little more structured and clean.

This started off as a little pet project at work to introduce more emotional design into our designs. I was still pretty green with using gsap and there was a lot, even a few months later, that I would do differently

## Some things I'm particularly proud of...
This project was the moment where SVG masking and clip-paths really clicked for me. My favorite thing about this project is the masked out ekg meter going through the progress bar. Another fun little addition (that often gets overlooked but oh well) was the particles that splash out at the point of impact when the meter enters and exits the heart. This was accomplished using GSAP's physics2D plugin and has since sparked a greater interest in coding my own cool physics simulations.

## Some things that kinda suck...
As this was meant just as a simple little demo, this progress bar is not particularly adaptive. The liquid that fills the heart has a hard coded increment value that assumes that the progress bar will take 10 increments to be full. I just found a y increment value that worked out and went with it. Obviously this is stupid.