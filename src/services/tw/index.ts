import type Twit from 'twit';
import { Word } from '../../interfaces';
import { getYesterdayWord } from '../words';
import { createCanvas, loadImage, registerFont } from 'canvas';
import type CanvasRenderingContext2D from 'canvas/types';
import path from 'path';

const loadFonts = (fontName: string) => {
  registerFont(path.join(__dirname, '../../fonts/Nunito-Regular.ttf'), {family: fontName});
  // registerFont(path.join(__dirname, '../../fonts/Nunito-Bold.ttf'), {family: fontName, weight: 'bold'});
  registerFont(path.join(__dirname, '../../fonts/Nunito-Italic.ttf'), {family: fontName, style: 'italic'});
};

const getFitLines = (text: string, ctx: CanvasRenderingContext2D, maxTextWidth: number) => {
  const lines = text.split('\n');
  const fitLines = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const words = line.split(' ');
    let fitLine = words[0];
    for (let j = 1; j < words.length; j++) {
      const word = words[j];
      if(ctx.measureText(fitLine + ' ' + word).width <= maxTextWidth) {
        fitLine += ' ' + word;
      } else {
        fitLines.push(fitLine);
        fitLine = word;
      }
      if(j + 1 === words.length) {
        fitLines.push(fitLine);
      }
    }
  }

  return fitLines;
};

const getMargin = (previusSize: number, nextSize: number, margin: number) => {
  const newMargin = previusSize / 2 + margin + nextSize / 2;
  
  return newMargin;
};

const drawLine = (line: string, word: string, positionY: number, lineColor: string, wordColor: string, ctx: CanvasRenderingContext2D) => {
  const regexp = new RegExp(`\\b${word}\\b`, 'gi');
  const words = line.split(regexp);
  const canvasWidth = ctx.canvas.width
  const wordWidth = ctx.measureText(word).width;
  let positionX = (canvasWidth - ctx.measureText(line).width) / 2;

  for (let i = 0; i < words.length; i++) {
    const part = words[i];
    const partWidth = ctx.measureText(part).width;
    positionX += partWidth / 2;
    ctx.fillStyle = lineColor;
    ctx.fillText(part, positionX, positionY);
    positionX += partWidth / 2 + wordWidth / 2;

    if(i !== words.length - 1) {
      ctx.fillStyle = wordColor;
      ctx.fillText(word, positionX, positionY);
      positionX += wordWidth / 2;
    }
  }
};

const getDateFormat = (date: string) => date.slice(5, 10).replace('-', '/');

const getImageDataURL = async (word: Word, date: string, constants: any) => {
  const {
    IMAGE_WIDTH,
    IMAGE_HEIGHT,
    PADDING,
    IMAGES_FOLDER,
    BACKGROUND_COLOR,
    FONT_SIZE_TITLE,
    FONT_NAME,
    FONT_COLOR,
    TEXT_ALIGN,
    TEXT_BASELINE,
    SHADOW_COLOR,
    SHADOW_BLUR,
    SHADOW_OFFSETX,
    SHADOW_OFFSETY,
    APP_NAME,
    MARGIN,
    FONT_SIZE_LINE,
    FONT_SIZE,
    IMAGE_MIME_TYPE,
    FONT_COLOR_WORD,
    FONT_SIZE_WORD,
    APP_SHORT_URL
  } = constants;

  const maxTextWidth = IMAGE_WIDTH - PADDING * 2;

  loadFonts(FONT_NAME);

  const image = await loadImage(path.join(__dirname, '../../images', IMAGES_FOLDER , 'background.jpg'));

  const canvas = createCanvas(IMAGE_WIDTH, IMAGE_HEIGHT);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = BACKGROUND_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(image, 0, 0, image.width, image.height);

  
  ctx.fillStyle = FONT_COLOR;
  ctx.textAlign = TEXT_ALIGN;
  ctx.textBaseline = TEXT_BASELINE;

  ctx.shadowColor = SHADOW_COLOR;
  ctx.shadowBlur = SHADOW_BLUR;
  ctx.shadowOffsetX = SHADOW_OFFSETX;
  ctx.shadowOffsetY = SHADOW_OFFSETY;

  ctx.font = `${FONT_SIZE_LINE}px ${FONT_NAME}`;
  const lines = getFitLines(word.line, ctx, maxTextWidth);
  
  let positionY = (IMAGE_HEIGHT
    - (FONT_SIZE_WORD
    + MARGIN
    + lines.length * FONT_SIZE_LINE
    + MARGIN / 2
    + FONT_SIZE
    + MARGIN / 2
    + FONT_SIZE))
    / 2
    + FONT_SIZE_WORD / 2;

  ctx.font = `${FONT_SIZE_TITLE}px ${FONT_NAME}`;
  ctx.fillText(`${APP_NAME} ${getDateFormat(date)}`, canvas.width / 2, getMargin(0, FONT_SIZE_TITLE, MARGIN));

  ctx.font = `${FONT_SIZE_WORD}px ${FONT_NAME}`;
  ctx.fillStyle = FONT_COLOR_WORD;
  ctx.fillText(word.word, canvas.width / 2, positionY);
  positionY += getMargin(FONT_SIZE_WORD, FONT_SIZE_LINE, MARGIN);

  ctx.font = `italic ${FONT_SIZE_LINE}px ${FONT_NAME}`;
  ctx.fillStyle = FONT_COLOR;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    drawLine(line, word.word, positionY, FONT_COLOR, FONT_COLOR_WORD, ctx);
    positionY += (i === lines.length - 1 ? getMargin(FONT_SIZE_LINE, FONT_SIZE, MARGIN / 2) : FONT_SIZE_LINE);
  }

  ctx.font = `${FONT_SIZE}px ${FONT_NAME}`;
  ctx.fillText(`🎼 ${word.song}`, canvas.width / 2, positionY);
  positionY += getMargin(FONT_SIZE, FONT_SIZE, MARGIN / 2);

  ctx.fillText(`💿 ${word.album}`, canvas.width / 2, positionY);

  ctx.font = `${FONT_SIZE_TITLE}px ${FONT_NAME}`;
  ctx.fillStyle = FONT_COLOR_WORD;
  ctx.fillText(APP_SHORT_URL, canvas.width / 2, IMAGE_HEIGHT - getMargin(FONT_SIZE_TITLE, 0, MARGIN));

  // text += `🔤 ${props.word.word}\n`;
  // text += `🎶 ${props.word.line} 🎶\n`;
  // text += `🎼 ${props.word.song}\n`;
  // text += `💿 ${props.word.album}\n\n`;

  const url = canvas.toDataURL(IMAGE_MIME_TYPE);

  return url;
};

export const tw = async (twit: Twit, constants: any) => {

  const twResult = await twit.post('statuses/update', { status: constants.APP_TODAY_TEXT });
  const response = `Post ok: ${(twResult.data as any).text}`;
  
  // const response = 'Post ok: no tweet';
  return response;
};

const getB64Image = (url: string, mimeType: string) => {
  const b64image = url.replace(`data:${mimeType};base64,`, '');
  return b64image;
};

const getAltText = (word: Word, date: string, constants: any) => {
  let altText = '';
  altText += `${constants.APP_NAME} ${getDateFormat(date)}\n\n`;
  altText += `${word.word}\n\n`;
  altText += `${word.line}\n`;
  altText += `🎼 ${word.song}\n`;
  altText += `💿 ${word.album}\n\n`;
  altText += `${constants.APP_SHORT_URL}`;
  return altText;
};

export const twyd = async (words: Word[], twit: Twit, constants: any) => {
  const word = getYesterdayWord(words);

  const imageDataURL = await getImageDataURL(word.word, word.date, constants);

  const b64image = getB64Image(imageDataURL, constants.IMAGE_MIME_TYPE);
  
  const imageResult = await twit.post('media/upload', { media_data: b64image });
  const mediaId = (imageResult.data as any).media_id_string;
  const meta = {
    media_id: mediaId,
    alt_text: { text: getAltText(word.word, word.date, constants) },
  };

  await twit.post('media/metadata/create', meta);
  const twResult = await twit.post('statuses/update', { status: constants.APP_YESTERDAY_MESSAGE, media_ids: [mediaId] });

  const response = `Post ok: ${(twResult.data as any).text}`;

  // const response = `<html><head></head><body style="margin: 0"><img src="${imageDataURL}" /></body></html>`;
  return response;
};
