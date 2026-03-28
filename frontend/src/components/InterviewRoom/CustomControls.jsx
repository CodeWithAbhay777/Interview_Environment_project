import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';
import React, { useState } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  MonitorUp, 
  PhoneOff, 
  Settings, 
  Users,
  ListChecks,
  FileAudio,
  PenTool,
  Code2,
} from 'lucide-react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const CustomControls = ({
  onLeave,
  chatVisibility,
  onToggleChat,
  interviewQuestionsVisibility,
  onToggleInterviewQuestions,
  canViewQuestions,
  canAnswerQuestions,
  answerAreaVisibility,
  onToggleAnswerArea,
  whiteboardVisibility,
  onToggleWhiteboard,
  codeEditorVisibility,
  onToggleCodeEditor,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const { useCameraState, useMicrophoneState } = useCallStateHooks();
  const { camera, status: cameraStatus } = useCameraState();
  const { microphone, status: micStatus } = useMicrophoneState();
  
  const call = useCall();

  return (
    <div className=' flex items-center justify-start gap-3 w-full max-w-xl '>
      {/* Camera Button */}
      <Button
        variant="ghost"
        size="icon"
        className={`h-11 w-11 rounded-full transition-all duration-200 ${
          cameraStatus === 'enabled'
            ? 'bg-gray-700 hover:bg-gray-200 text-white'
            : 'bg-red-600 hover:bg-red-700 text-white'
        }`}
        onClick={() => camera.toggle()}
        title={cameraStatus === 'enabled' ? 'Turn Camera Off' : 'Turn Camera On'}
      >
        {cameraStatus === 'enabled' ? (
          <Video className="h-5 w-5" />
        ) : (
          <VideoOff className="h-5 w-5" />
        )}
      </Button>

      {/* Microphone Button */}
      <Button
        variant="ghost"
        size="icon"
        className={`h-11 w-11 rounded-full transition-all duration-200 ${
          micStatus === 'enabled'
            ? 'bg-gray-700 hover:bg-gray-200 text-white'
            : 'bg-red-600 hover:bg-red-700 text-white'
        }`}
        onClick={() => microphone.toggle()}
        title={micStatus === 'enabled' ? 'Mute' : 'Unmute'}
      >
        {micStatus === 'enabled' ? (
          <Mic className="h-5 w-5" />
        ) : (
          <MicOff className="h-5 w-5" />
        )}
      </Button>

      {/* Screen Share Button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-11 w-11 rounded-full bg-gray-700 hover:bg-gray-200 text-white transition-all duration-200 hidden sm:flex"
        onClick={() => call?.screenShare?.toggle()}
        title="Share Screen"
      >
        <MonitorUp className="h-5 w-5" />
      </Button>

      {/* Chat Button */}
      <Button
        variant="ghost"
        size="icon"
        className={`h-11 w-11 rounded-full bg-gray-700 hover:bg-gray-200 text-white transition-all duration-200 ${chatVisibility ? 'bg-gray-300 text-black' : ''}`}
        onClick={onToggleChat}
        title="Toggle Chat"
      >
        <Users className="h-5 w-5" />
      </Button>

      {/* Questions Button */}
      {canViewQuestions ? (
        <Button
          variant="ghost"
          size="icon"
          className={`h-11 w-11 rounded-full bg-gray-700 hover:bg-gray-200 text-white transition-all duration-200 ${interviewQuestionsVisibility ? 'bg-gray-300 text-black' : ''}`}
          onClick={onToggleInterviewQuestions}
          title="Toggle Questions"
        >
          <ListChecks className="h-5 w-5" />
        </Button>
      ) : null}

      {/* Answer Area Button */}
      {canAnswerQuestions ? (
        <Button
          variant="ghost"
          size="icon"
          className={`h-11 w-11 rounded-full bg-gray-700 hover:bg-gray-200 text-white transition-all duration-200 ${answerAreaVisibility ? 'bg-gray-300 text-black' : ''}`}
          onClick={onToggleAnswerArea}
          title="Toggle Answer Area"
        >
          <FileAudio className="h-5 w-5" />
        </Button>
      ) : null}

      {/* Whiteboard Button */}
      <Button
        variant="ghost"
        size="icon"
        className={`h-11 w-11 rounded-full bg-gray-700 hover:bg-gray-200 text-white transition-all duration-200 ${whiteboardVisibility ? 'bg-gray-300 text-black' : ''}`}
        onClick={onToggleWhiteboard}
        title="Toggle Whiteboard"
      >
        <PenTool className="h-5 w-5" />
      </Button>

      {/* Code Editor Button */}
      <Button
        variant="ghost"
        size="icon"
        className={`h-11 w-11 rounded-full bg-gray-700 hover:bg-gray-200 text-white transition-all duration-200 ${codeEditorVisibility ? 'bg-gray-300 text-black' : ''}`}
        onClick={onToggleCodeEditor}
        title="Toggle Code Editor"
      >
        <Code2 className="h-5 w-5" />
      </Button>

      {/* Settings Button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-11 w-11 rounded-full bg-gray-700 hover:bg-gray-200 text-white transition-all duration-200 hidden sm:flex"
        onClick={() => setShowSettings((prev) => !prev)}
        title="Settings"
      >
        <Settings className="h-5 w-5" />
      </Button>

      {/* Leave Button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-11 w-11 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all duration-200"
        onClick={onLeave}
        title="Leave Call"
      >
        <PhoneOff className="h-5 w-5" />
      </Button>

      <DeviceSettings open={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
};

// DEVICE SETTINGS DIALOG
const DeviceSettings = ({ open, onClose }) => {
  const { useCameraState, useMicrophoneState, useSpeakerState } = useCallStateHooks();
  const { camera, devices: cams, selectedDevice: selCam } = useCameraState();
  const { microphone, devices: mics, selectedDevice: selMic } = useMicrophoneState();
  const { speaker, devices: spks, selectedDevice: selSpk } = useSpeakerState();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#2a2a2a] border-gray-700 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Device Settings</DialogTitle>
          <DialogDescription className="text-gray-400">
            Configure your audio and video devices
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Camera Selection */}
          <div className="space-y-2">
            <Label htmlFor="camera" className="text-white flex items-center">
              <Video className="h-4 w-4 mr-2" />
              Camera
            </Label>
            <Select
              value={selCam || ''}
              onValueChange={(value) => camera.select(value)}
            >
              <SelectTrigger id="camera" className="bg-[#1a1a1a] border-gray-700 text-white">
                <SelectValue placeholder="Select camera" />
              </SelectTrigger>
              <SelectContent className="bg-[#2a2a2a] border-gray-700 text-white">
                {cams?.map((d) => (
                  <SelectItem key={d.deviceId} value={d.deviceId}>
                    {d.label || 'Camera'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Microphone Selection */}
          <div className="space-y-2">
            <Label htmlFor="microphone" className="text-white flex items-center">
              <Mic className="h-4 w-4 mr-2" />
              Microphone
            </Label>
            <Select
              value={selMic || ''}
              onValueChange={(value) => microphone.select(value)}
            >
              <SelectTrigger id="microphone" className="bg-[#1a1a1a] border-gray-700 text-white">
                <SelectValue placeholder="Select microphone" />
              </SelectTrigger>
              <SelectContent className="bg-[#2a2a2a] border-gray-700 text-white">
                {mics?.map((d) => (
                  <SelectItem key={d.deviceId} value={d.deviceId}>
                    {d.label || 'Microphone'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Speaker Selection */}
          <div className="space-y-2">
            <Label htmlFor="speaker" className="text-white flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Speaker
            </Label>
            <Select
              value={selSpk || ''}
              onValueChange={(value) => speaker?.select(value)}
            >
              <SelectTrigger id="speaker" className="bg-[#1a1a1a] border-gray-700 text-white">
                <SelectValue placeholder="Select speaker" />
              </SelectTrigger>
              <SelectContent className="bg-[#2a2a2a] border-gray-700 text-white">
                {spks?.map((d) => (
                  <SelectItem key={d.deviceId} value={d.deviceId}>
                    {d.label || 'Speaker'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomControls;