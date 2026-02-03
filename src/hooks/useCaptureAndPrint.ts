import { useState } from 'react';
import ViewShot from 'react-native-view-shot';
import * as Print from 'expo-print';
import { convertImageToPDF } from '../utils/convertImageToPDF.utils';
import * as FileSystem from 'expo-file-system/legacy';

const useCaptureAndPrint = () => {
  const [loading, setLoading] = useState(false);

  const captureAndPrint = async (viewShotRef: React.RefObject<ViewShot>) => {
    if (!viewShotRef.current) {
      console.warn('ViewShot ref is not defined');
      return;
    }

    try {
      setLoading(true);

      if (viewShotRef.current && typeof viewShotRef.current.capture === 'function') {
        const uri = await viewShotRef.current.capture();
        if (uri) {
          const uriPDF = await convertImageToPDF(uri);
          await Print.printAsync({ uri: uriPDF });
          // console.log('Screenshot captured:', uriPDF);

          setTimeout(async () => { // remove o arquivo de imagem gerado
            try {
              if(uriPDF) await FileSystem.deleteAsync(uriPDF, { idempotent: true });
              // console.log('Temporary PDF deleted');
            } catch (error) {
              console.error('Error deleting temporary PDF:', error);
            }
          }, 5000);
        }
      } else {
        console.warn('ViewShot ref is not defined or capture() function is missing');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error while capturing screenshot:', error);
      setLoading(false);
    }
  };

  return { captureAndPrint, loading };
};

export default useCaptureAndPrint;
