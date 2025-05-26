/* 
 * 文件位置：themes/你的主题名/source/js/subtitle.js
 * 在主题的js目录下创建这个文件
 */

// 今日诗词API调用
async function getJinrishiciContent() {
  try {
    const response = await fetch('https://v1.jinrishici.com/all.json');
    const data = await response.json();
    if (data && data.content) {
      return `${data.content} —— ${data.author}《${data.origin}》`;
    }
    return null;
  } catch (error) {
    console.error('获取今日诗词失败:', error);
    return null;
  }
}

// 一言API调用
async function getHitokotoContent() {
  try {
    // 一言API支持多种分类，可以通过参数控制
    const response = await fetch('https://v1.hitokoto.cn/?c=i&c=d&c=h&encode=json');
    const data = await response.json();
    
    // 格式化输出，包含来源信息
    let result = data.hitokoto;
    if (data.from) {
      result += ` —— ${data.from}`;
    }
    if (data.from_who && data.from_who !== data.from) {
      result += `「${data.from_who}」`;
    }
    
    return result;
  } catch (error) {
    console.error('获取一言失败:', error);
    return null;
  }
}

// 一句网API调用
async function getYijuzhanContent() {
  try {
    // 使用JSONP方式调用一句网API
    const response = await fetch('https://yijuzhan.com/api/word.php?m=json&jsonp=?');
    const data = await response.json();
    return data.word || data.result;
  } catch (error) {
    console.error('获取一句网内容失败:', error);
    // 备用方案：直接请求
    try {
      const response2 = await fetch('https://api.uomg.com/api/rand.qinghua?format=json');
      const data2 = await response2.json();
      return data2.content;
    } catch (error2) {
      console.error('备用API也失败:', error2);
      return null;
    }
  }
}

// 根据配置获取内容
async function getSubtitleContent(config) {
  let content = '';
  
  console.log('正在获取内容，source配置:', config.source);
  
  switch (config.source) {
    case 1:
      console.log('调用一言API...');
      content = await getHitokotoContent();
      break;
    case 2:
      console.log('调用一句网API...');
      content = await getYijuzhanContent();
      break;
    case 3:
      console.log('调用今日诗词API...');
      content = await getJinrishiciContent();
      break;
    default:
      console.log('未配置API调用或配置错误');
      content = null;
  }
  
  // 如果API调用失败，使用自定义内容
  if (!content && config.sub && config.sub.length > 0) {
    console.log('API调用失败，使用自定义内容');
    const randomIndex = Math.floor(Math.random() * config.sub.length);
    content = config.sub[randomIndex];
  }
  
  const finalContent = content || '生活明朗, 万物可爱, 人间值得, 未来可期.';
  console.log('最终显示内容:', finalContent);
  
  return finalContent;
}

// 打字效果
function typewriterEffect(element, text, config) {
  if (!config.effect) {
    element.textContent = text;
    return;
  }
  
  let index = 0;
  element.textContent = '';
  
  setTimeout(() => {
    const timer = setInterval(() => {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
      } else {
        clearInterval(timer);
        
        if (config.loop) {
          setTimeout(() => {
            let backIndex = text.length;
            const backTimer = setInterval(() => {
              if (backIndex > 0) {
                element.textContent = text.substring(0, backIndex - 1);
                backIndex--;
              } else {
                clearInterval(backTimer);
                setTimeout(() => typewriterEffect(element, text, config), 500);
              }
            }, config.backSpeed);
          }, 2000);
        }
      }
    }, config.typeSpeed);
  }, config.startDelay);
}

// 初始化副标题
async function initSubtitle() {
  // 从页面中获取配置（由模板注入）
  const configScript = document.querySelector('#subtitle-config');
  if (!configScript) return;
  
  const config = JSON.parse(configScript.textContent);
  
  if (!config.enable) return;
  
  const subtitleElement = document.querySelector('.footer-subtitle');
  if (!subtitleElement) return;
  
  const content = await getSubtitleContent(config);
  typewriterEffect(subtitleElement, content, config);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initSubtitle);