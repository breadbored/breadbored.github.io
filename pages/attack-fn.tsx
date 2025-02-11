import React, { useState, useEffect } from 'react';

const AttackConeVisualizer = () => {
    const [rawVectorX, setRawVectorX] = useState(1);
    const [rawVectorY, setRawVectorY] = useState(0);
    const [normalizedX, setNormalizedX] = useState(1);
    const [normalizedY, setNormalizedY] = useState(0);
    const [coneAngle, setConeAngle] = useState(90);
    const [directionAngle, setDirectionAngle] = useState(0);

    // Normalize the vector and update angles whenever raw values change
    useEffect(() => {
        const magnitude = Math.sqrt(rawVectorX * rawVectorX + rawVectorY * rawVectorY);
        if (magnitude > 0) {
            const newNormalizedX = rawVectorX / magnitude;
            const newNormalizedY = rawVectorY / magnitude;
            setNormalizedX(newNormalizedX);
            setNormalizedY(newNormalizedY);
            const angleRad = Math.atan2(rawVectorY, rawVectorX);
            setDirectionAngle((angleRad * 180) / Math.PI);
        }
    }, [rawVectorX, rawVectorY]);

    // Calculate the cone path using normalized values
    const generateConePath = () => {
        const radius = 50;
        const halfConeAngle = coneAngle / 2;

        const angleRad = Math.atan2(normalizedY, normalizedX);
        const leftAngle = angleRad - (halfConeAngle * Math.PI / 180);
        const rightAngle = angleRad + (halfConeAngle * Math.PI / 180);

        const leftX = radius * Math.cos(leftAngle);
        const leftY = radius * Math.sin(leftAngle);
        const rightX = radius * Math.cos(rightAngle);
        const rightY = radius * Math.sin(rightAngle);

        return `M 0 0 L ${leftX} ${leftY} A ${radius} ${radius} 0 0 1 ${rightX} ${rightY} Z`;
    };

    const handleInputChange = (value: unknown, setter: (n: number) => void) => {
        const numValue = parseFloat(value as string);
        if (!isNaN(numValue)) {
            setter(numValue);
        }
    };

    return (
        <div className="w-full max-w-2xl p-4 bg-white rounded-lg shadow">
            <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">Attack Cone Visualization</h2>
            </div>
            <div className="space-y-6">
                <div className="flex flex-col space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center space-x-4">
                            <label className="text-sm w-24">X Direction:</label>
                            <input
                                type="number"
                                value={rawVectorX}
                                onChange={(e) => handleInputChange(e.target.value, setRawVectorX)}
                                className="w-24 px-2 py-1 border rounded"
                                step="0.1"
                            />
                            <div className="text-sm text-gray-500">
                                Normalized: {normalizedX.toFixed(3)}
                            </div>
                        </div>
                        <input
                            type="range"
                            min="-1"
                            max="1"
                            step="0.1"
                            value={normalizedX}
                            onChange={(e) => handleInputChange((e.target.value as unknown as number) * Math.abs(rawVectorX), setRawVectorX)}
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center space-x-4">
                            <label className="text-sm w-24">Y Direction:</label>
                            <input
                                type="number"
                                value={rawVectorY}
                                onChange={(e) => handleInputChange(e.target.value, setRawVectorY)}
                                className="w-24 px-2 py-1 border rounded"
                                step="0.1"
                            />
                            <div className="text-sm text-gray-500">
                                Normalized: {normalizedY.toFixed(3)}
                            </div>
                        </div>
                        <input
                            type="range"
                            min="-1"
                            max="1"
                            step="0.1"
                            value={normalizedY}
                            onChange={(e) => handleInputChange((e.target.value as unknown as number) * Math.abs(rawVectorY), setRawVectorY)}
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center space-x-4">
                            <label className="text-sm w-24">Cone Angle:</label>
                            <input
                                type="number"
                                value={coneAngle}
                                onChange={(e) => handleInputChange(e.target.value, setConeAngle)}
                                className="w-24 px-2 py-1 border rounded"
                                min="0"
                                max="360"
                                step="5"
                            />
                            <div className="text-sm">degrees</div>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="360"
                            step="5"
                            value={coneAngle}
                            onChange={(e) => setConeAngle(parseFloat(e.target.value))}
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="relative w-full h-96 border rounded-lg bg-white">
                    <svg
                        viewBox="-120 -120 240 240"
                        className="w-full h-full"
                        style={{ transform: 'scale(1, -1)' }}
                    >
                        {/* Grid */}
                        <g stroke="#ddd" strokeWidth="0.5">
                            <line x1="-100" y1="0" x2="100" y2="0" />
                            <line x1="0" y1="-100" x2="0" y2="100" />
                            <circle cx="0" cy="0" r="100" fill="none" />
                        </g>

                        {/* Attack radius circle */}
                        <circle
                            cx="0"
                            cy="0"
                            r="50"
                            fill="none"
                            stroke="#666"
                            strokeWidth="1"
                            strokeDasharray="4"
                        />

                        {/* Cone */}
                        <path
                            d={generateConePath()}
                            fill="rgba(255,0,0,0.2)"
                            stroke="red"
                            strokeWidth="1"
                        />

                        {/* Raw vector */}
                        <line
                            x1="0"
                            y1="0"
                            x2={rawVectorX * 50 / Math.max(1, Math.sqrt(rawVectorX * rawVectorX + rawVectorY * rawVectorY))}
                            y2={rawVectorY * 50 / Math.max(1, Math.sqrt(rawVectorX * rawVectorX + rawVectorY * rawVectorY))}
                            stroke="#666"
                            strokeWidth="1"
                            strokeDasharray="4"
                        />

                        {/* Normalized vector */}
                        <line
                            x1="0"
                            y1="0"
                            x2={normalizedX * 50}
                            y2={normalizedY * 50}
                            stroke="red"
                            strokeWidth="2"
                            markerEnd="url(#arrowhead)"
                        />

                        {/* Arrowhead marker */}
                        <defs>
                            <marker
                                id="arrowhead"
                                markerWidth="10"
                                markerHeight="7"
                                refX="9"
                                refY="3.5"
                                orient="auto"
                            >
                                <polygon points="0 0, 10 3.5, 0 7" fill="red" />
                            </marker>
                        </defs>

                        {/* Angle markers */}
                        <g transform={`rotate(${directionAngle})`}>
                            <path
                                d={`M 15 0 A 15 15 0 0 0 ${15 * Math.cos(coneAngle * Math.PI / 360)} ${15 * Math.sin(coneAngle * Math.PI / 360)}`}
                                fill="none"
                                stroke="#666"
                                strokeWidth="1"
                            />
                            <text
                                x="20"
                                y="10"
                                fill="#666"
                                fontSize="8"
                                transform="scale(1, -1)"
                            >
                                {(coneAngle / 2).toFixed(1)}°
                            </text>
                        </g>
                    </svg>

                    {/* Info display */}
                    <div className="absolute top-4 right-4 bg-white bg-opacity-80 p-2 rounded text-sm">
                        <div>Direction: {directionAngle.toFixed(1)}°</div>
                        <div>Cone Width: {coneAngle.toFixed(1)}°</div>
                        <div>Magnitude: {Math.sqrt(rawVectorX * rawVectorX + rawVectorY * rawVectorY).toFixed(2)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttackConeVisualizer;