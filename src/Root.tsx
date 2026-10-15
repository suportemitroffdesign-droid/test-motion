import React from 'react';
import {Composition} from 'remotion';
import {MitroffIntro} from './MitroffIntro';
import {MitroffReelsFinal} from './production/Production';
import Voice from './production/voice-timing.json';
export const Root: React.FC = () => <><Composition id="MitroffIntro" component={MitroffIntro} durationInFrames={600} fps={30} width={1080} height={1920}/><Composition id="MitroffReelsFinal" component={MitroffReelsFinal} durationInFrames={Voice.duration_frames} fps={30} width={1080} height={1920}/></>;
