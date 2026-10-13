import React from 'react';
import {Composition} from 'remotion';
import {MitroffIntro} from './MitroffIntro';
export const Root: React.FC = () => <Composition id="MitroffIntro" component={MitroffIntro} durationInFrames={600} fps={30} width={1080} height={1920}/>;
