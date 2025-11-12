import React from 'react';

function createTrick(name, description)
{
    const trick = {};
    trick.name = name;
    trick.description = description;
    console.log(`Trick created: ${name}`);
    return trick;
}

const halfcab = createTrick("Half Cab", "A 180-degree turn performed while riding switch.");
// Trick Component
const Trick = ({ tricks }) => {
    return (
        <div className="skateboard-trick">
            <h2>{tricks.name}</h2>
            <video controls width="600">
                <source src={tricks.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <p>{tricks.description}</p>
        </div>
    );
};

export default Trick;