// Importa o módulo de feedback tátil nativo (Haptics)
import * as Haptics from 'expo-haptics';
// Importa o componente para criar gradientes lineares visuais
import { LinearGradient } from 'expo-linear-gradient';
// Importa o objeto de roteamento de navegação do Expo Router
import { router } from 'expo-router';
// Importa o sensor DeviceMotion para rastrear a inclinação física do dispositivo
import { DeviceMotion } from 'expo-sensors';
// Importa utilitários da biblioteca de vídeo nativa do Expo
import { useVideoPlayer, VideoView } from "expo-video";
// Importa os hooks do React para gerenciar efeitos colaterais e referências persistentes
import { useEffect, useRef } from 'react';
// Importa componentes visuais e estruturais nativos do React Native
import { Pressable, StyleSheet, Text, View } from "react-native";
// Importa Reanimated e suas funções auxiliares para animações fluidas na thread de UI
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSpring,
  withTiming
} from 'react-native-reanimated';
// Importa o hook para obter as margens de área segura do dispositivo (notch, barra de navegação)
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// Importa a função runOnJS para executar rotinas da thread JS a partir de worklets da thread de UI
import { runOnJS } from 'react-native-worklets';
// Importa o arquivo de vídeo do mar localizado nos recursos do projeto
import backgroundVideo from "../../../assets/videos/sea.mp4";

// Array contendo as letras individuais do logotipo "ANCHOR" para animação sequencial
const LOGO_LETTERS = ['A', 'N', 'C', 'H', 'O', 'R'];

// Definição das propriedades do componente de letra animada
interface AnimatedLetterProps {
  letter: string; // A letra a ser renderizada
  index: number; // O índice da letra na palavra
  logoOpacity: SharedValue<number>; // O valor de opacidade compartilhada do logo completo
}

// Componente secundário que anima cada letra individual do logo de forma independente
function AnimatedLetter({ letter, index, logoOpacity }: AnimatedLetterProps) {
  // Define o estilo animado da letra usando worklets do Reanimated
  const letterStyle = useAnimatedStyle(() => {
    "worklet";
    // Define o ponto de partida do atraso baseado no índice da letra
    const startRange = index * 0.12;
    // Define o ponto final da animação de entrada desta letra específica
    const endRange = Math.min(startRange + 0.4, 1);

    // Interpola o progresso geral da opacidade do logo para a letra específica
    const letterProgress = interpolate(
      logoOpacity.value,
      [startRange, endRange],
      [0, 1],
      Extrapolation.CLAMP
    );

    // Retorna a opacidade e o deslocamento vertical baseado na interpolação
    return {
      opacity: letterProgress,
      transform: [
        { translateY: interpolate(letterProgress, [0, 1], [-12, 0]) }
      ],
    };
  });

  return (
    // Renderiza a letra como um texto animado aplicando os estilos calculados
    <Animated.Text style={[styles.logoText, letterStyle]}>
      {letter}
    </Animated.Text>
  );
}

// Componente principal da tela Sea
export default function Sea() {
  // Obtém os limites de segurança da tela (como notch de câmera)
  const insets = useSafeAreaInsets();
  // Referência para impedir interações repetidas durante a transição de tela
  const isTransitioningRef = useRef(false);

  // Inicializa e configura o player de vídeo nativo em looping silencioso
  const player = useVideoPlayer(backgroundVideo, (playerInstance) => {
    playerInstance.loop = true;
    playerInstance.muted = true;
    playerInstance.play();
  });

  // Valor compartilhado para controlar a animação de reflexo contínuo (shimmer) no botão
  const shimmerProgress = useSharedValue(0);
  // Valor compartilhado para a translação vertical da entrada inicial do botão
  const buttonTranslationY = useSharedValue(80);
  // Valor compartilhado para a opacidade da entrada inicial do botão
  const buttonOpacity = useSharedValue(0);
  // Valor compartilhado para gerenciar a entrada sequencial do logotipo
  const logoOpacity = useSharedValue(0);
  // Valor compartilhado para a translação vertical da entrada inicial do logotipo
  const logoTranslationY = useSharedValue(-20);
  // Valor compartilhado para a animação pulsante da borda do botão
  const borderPulse = useSharedValue(0);
  // Valor compartilhado para armazenar a inclinação horizontal obtida do sensor
  const tiltX = useSharedValue(0);
  // Valor compartilhado para armazenar a inclinação vertical obtida do sensor
  const tiltY = useSharedValue(0);

  // Valor compartilhado que monitora o progresso da transição de abertura (portal)
  const transitionProgress = useSharedValue(0);
  // Valor compartilhado que controla a intensidade da vinheta de sombra nas bordas
  const vignetteOpacity = useSharedValue(0.35);
  // Valor compartilhado para controlar a escala do botão quando pressionado
  const buttonPressScale = useSharedValue(1);

  // Efeito executado na inicialização da tela
  useEffect(() => {
    // Inicia a animação contínua e repetitiva de shimmer do botão (timing infinito)
    shimmerProgress.value = withRepeat(withTiming(1, { duration: 2000 }), -1, false);

    // Inicia a animação de entrada com mola amortecida para o botão (subida suave)
    buttonTranslationY.value = withDelay(300, withSpring(0, { damping: 14, stiffness: 80 }));
    // Inicia a animação de esvanecimento de entrada para o botão
    buttonOpacity.value = withDelay(300, withTiming(1, { duration: 600 }));

    // Inicia a animação de esvanecimento de entrada para o logotipo
    logoOpacity.value = withDelay(600, withTiming(1, { duration: 1000 }));
    // Inicia a animação de entrada com mola amortecida para o logotipo (descida suave)
    logoTranslationY.value = withDelay(600, withSpring(0, { damping: 15, stiffness: 70 }));

    // Inicia o loop contínuo e pulsante para a borda do botão
    borderPulse.value = withRepeat(withTiming(1, { duration: 2000 }), -1, true);

    // Define a frequência de amostragem do sensor de movimento (16ms = ~60 FPS)
    DeviceMotion.setUpdateInterval(16);
    // Adiciona o ouvinte para capturar as informações de giroscópio do aparelho
    const subscription = DeviceMotion.addListener((data) => {
      // Se houver rotação ativa e o app não estiver em transição de tela
      if (data.rotation && !isTransitioningRef.current) {
        // Atualiza a inclinação com interpolação de timing curto para suavizar ruídos
        tiltX.value = withTiming(data.rotation.gamma, { duration: 100 });
        tiltY.value = withTiming(data.rotation.beta, { duration: 100 });
      }
    });

    // Remove o listener do sensor ao desmontar o componente para economizar bateria e memória
    return () => {
      subscription.remove();
    };
  }, []);

  // Handler disparado quando o usuário inicia o toque físico no botão
  const handlePressIn = () => {
    if (isTransitioningRef.current) return;
    // Diminui o botão levemente usando spring (efeito elástico de clique)
    buttonPressScale.value = withSpring(0.95, { damping: 10, stiffness: 150 });
  };

  // Handler disparado quando o usuário solta o toque físico do botão
  const handlePressOut = () => {
    if (isTransitioningRef.current) return;
    // Restaura o tamanho original do botão usando spring
    buttonPressScale.value = withSpring(1, { damping: 10, stiffness: 150 });
  };

  // Handler disparado ao confirmar o clique (onPress) no botão
  const handlePress = async () => {
    if (isTransitioningRef.current) return;
    // Ativa o estado de transição para bloquear novos cliques
    isTransitioningRef.current = true;

    try {
      // Executa o motor háptico do celular enviando um feedback de sucesso (vibração premium)
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.log("Erro ao acionar feedback tátil:", error);
    }

    // Escurece gradativamente a vinheta de borda para focar no centro
    vignetteOpacity.value = withTiming(0.65, { duration: 800 });

    // Inicia a animação da transição principal (efeito portal)
    transitionProgress.value = withTiming(1, { duration: 800 }, (finished) => {
      // Ao terminar a transição, redireciona o usuário para o dashboard principal
      if (finished) {
        runOnJS(onTransitionComplete)();
      }
    });
  };

  // Função disparada no thread JS que executa a navegação entre rotas
  const onTransitionComplete = () => {
    // Substitui a rota atual para carregar a Home sem opção de retorno direto
    router.replace('/(sea)/home');
  };

  // Estilo animado responsável pelo efeito de paralaxe 3D na imagem/vídeo de fundo
  const animatedBackgroundStyle = useAnimatedStyle(() => {
    "worklet";
    // Se estiver transitando, anula gradualmente o efeito de paralaxe
    const currentTiltX = interpolate(transitionProgress.value, [0, 1], [tiltX.value, 0]);
    const currentTiltY = interpolate(transitionProgress.value, [0, 1], [tiltY.value, 0]);

    // Mapeia os dados do giroscópio para deslocamento de pixels (máximo 25px de movimento)
    const translateX = interpolate(currentTiltX, [-1, 1], [-25, 25]);
    const translateY = interpolate(currentTiltY, [-1, 1], [-25, 25]);
    return {
      // Aplica a translação e aumenta a escala em 1.15x para não expor as bordas cinzas ao mover
      transform: [{ translateX }, { translateY }, { scale: 1.15 }] as any,
    };
  });

  // Estilo animado da camada de vinheta preta (para dar contraste ao texto e profundidade)
  const animatedVignetteStyle = useAnimatedStyle(() => {
    "worklet";
    // Mapeia e anula gradualmente o efeito de paralaxe do giroscópio
    const currentTiltX = interpolate(transitionProgress.value, [0, 1], [tiltX.value, 0]);
    const currentTiltY = interpolate(transitionProgress.value, [0, 1], [tiltY.value, 0]);

    // Move a vinheta no sentido oposto ao fundo para reforçar o efeito de parallax multicamada
    const translateX = interpolate(currentTiltX, [-1, 1], [12, -12]);
    const translateY = interpolate(currentTiltY, [-1, 1], [12, -12]);

    return {
      opacity: vignetteOpacity.value,
      transform: [{ translateX }, { translateY }, { scale: 1.1 }] as any,
    };
  });

  // Estilo animado responsável pelo paralaxe nas camadas superiores de texto (UI)
  const animatedUIParallaxStyle = useAnimatedStyle(() => {
    "worklet";
    // Mapeia e anula gradualmente o efeito de paralaxe do giroscópio
    const currentTiltX = interpolate(transitionProgress.value, [0, 1], [tiltX.value, 0]);
    const currentTiltY = interpolate(transitionProgress.value, [0, 1], [tiltY.value, 0]);

    // Cria um deslocamento intermediário de pixels (15px) na UI
    const translateX = interpolate(currentTiltX, [-1, 1], [15, -15]);
    const translateY = interpolate(currentTiltY, [-1, 1], [15, -15]);
    return {
      transform: [{ translateX }, { translateY }] as any,
    };
  });

  // Estilo animado do raio reflexivo (shimmer) que atravessa o botão repetidamente
  const animatedShimmerStyle = useAnimatedStyle(() => {
    "worklet";
    // Desvanece o shimmer à medida que o botão começa a expandir no portal
    const opacity = interpolate(transitionProgress.value, [0, 1], [1, 0]);
    // Move horizontalmente a faixa de luz reflexiva pelo container do botão
    const translateX = interpolate(shimmerProgress.value, [0, 1], [-150, 350]);
    return {
      opacity,
      transform: [{ translateX }, { skewX: '-20deg' }] as any, // Inclina a luz em 20 graus para um efeito premium
    };
  });

  // Estilo animado da transição de zoom explosivo do botão (Portal Transition)
  const animatedEntranceStyle = useAnimatedStyle(() => {
    "worklet";
    // Controla o brilho da borda oscilante baseada no loop de pulso
    const pulseGlow = interpolate(borderPulse.value, [0, 1], [0.2, 0.6]);
    // Desvanece a borda completamente durante a transição do portal
    const borderOpacity = interpolate(transitionProgress.value, [0, 1], [pulseGlow, 0]);

    // Escala massiva do botão (de 1x inicial até 25x no clímax da transição)
    const baseScale = interpolate(transitionProgress.value, [0, 1], [1, 25]);
    // Combina o tamanho de escala do portal com a escala física de toque (Press)
    const combinedScale = baseScale * buttonPressScale.value;

    return {
      opacity: buttonOpacity.value,
      transform: [
        { translateY: buttonTranslationY.value },
        { scale: combinedScale }
      ],
      borderColor: `rgba(255, 255, 255, ${borderOpacity})`,
    };
  });

  // Estilo animado que desvanece e sobe o logotipo ao iniciar a transição do portal
  const animatedLogoStyle = useAnimatedStyle(() => {
    "worklet";
    const transitionY = interpolate(transitionProgress.value, [0, 1], [0, -40]);
    const transitionOpacity = interpolate(transitionProgress.value, [0, 1], [1, 0]);

    return {
      opacity: logoOpacity.value * transitionOpacity,
      transform: [{ translateY: logoTranslationY.value + transitionY }] as any,
    };
  });

  // Estilo animado que desvanece o texto interno do botão para não distorcê-lo com a escala
  const animatedButtonTextStyle = useAnimatedStyle(() => {
    "worklet";
    const opacity = interpolate(transitionProgress.value, [0, 0.3], [1, 0]);
    return {
      opacity,
    };
  });

  // Estilo animado que faz a tela escurecer por trás do portal no final da animação
  const animatedFadeOverlayStyle = useAnimatedStyle(() => {
    "worklet";
    const opacity = interpolate(transitionProgress.value, [0, 1], [0, 1]);
    return {
      opacity,
    };
  });

  return (
    // View principal de container do projeto
    <View style={styles.container}>
      {/* Camada inferior contendo o player de vídeo animado com paralaxe */}
      <Animated.View style={[StyleSheet.absoluteFill, animatedBackgroundStyle]}>
        <VideoView style={StyleSheet.absoluteFill} player={player} nativeControls={false} contentFit="cover" />
      </Animated.View>

      {/* Camada de vinheta de sombreamento de bordas com movimento oposto */}
      <Animated.View style={[styles.overlay, animatedVignetteStyle]} />

      {/* Camada flutuante contendo os componentes interativos de UI com paralaxe */}
      <Animated.View style={[StyleSheet.absoluteFill, animatedUIParallaxStyle, styles.uiLayer]}>

        {/* Bloco de logotipo com letras animadas sequencialmente */}
        <Animated.View style={[styles.logoContainer, { marginTop: insets.top + 40 }, animatedLogoStyle]}>
          <View style={styles.lettersWrapper}>
            {LOGO_LETTERS.map((letter, index) => (
              <AnimatedLetter
                key={index}
                letter={letter}
                index={index}
                logoOpacity={logoOpacity}
              />
            ))}
          </View>
          {/* Subtítulo decorativo com sombreamento de texto para melhorar a legibilidade */}
          <Text style={styles.logoSubtitle}>Explore the deep blue</Text>
        </Animated.View>

        {/* Wrapper animado do botão que aplica a transição de portal (zoom 25x) */}
        <Animated.View style={[styles.animatedWrapper, animatedEntranceStyle]}>
          <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
            style={styles.buttonContainer}
          >
            {/* Componente que aplica o visual translúcido de vidro de fundo */}
            <BlurBackground />

            {/* Raio reflexivo contínuo animado passando por cima do botão */}
            <Animated.View style={[styles.shimmerBeam, animatedShimmerStyle]}>
              <LinearGradient
                colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.35)', 'rgba(255,255,255,0)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>

            {/* Texto interno do botão que desaparece logo no início do zoom */}
            <Animated.Text style={[styles.buttonText, animatedButtonTextStyle]}>
              Get Started
            </Animated.Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
      
      {/* Tela de transição preta/azul escura que se torna opaca para carregar a nova rota de destino */}
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { backgroundColor: '#01161e' }, animatedFadeOverlayStyle]}
      />
    </View>
  );
}

// Componente auxiliar para renderizar o efeito glassmorphism translúcido no botão
const BlurBackground = () => (
  <View style={[StyleSheet.absoluteFill, styles.glassBase]}>
    <LinearGradient
      colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
      style={StyleSheet.absoluteFill}
    />
  </View>
);

// Objeto de folhas de estilo otimizado (StyleSheet)
const styles = StyleSheet.create({
  // Container raiz que ocupa toda a dimensão da tela
  container: {
    flex: 1,
  },
  // Camada de interface de usuário posicionada acima do fundo
  uiLayer: {
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  // Camada de máscara preta que simula sombras nas bordas do visor
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000',
  },
  // Container do logotipo posicionado no topo da tela com margem de segurança
  logoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  // Disposição horizontal para as letras individuais do logo
  lettersWrapper: {
    flexDirection: 'row',
  },
  // Estilo individual de fonte de cada letra com sombra projetada
  logoText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    marginHorizontal: 4,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  // Estilo do subtítulo do logotipo com espaçamento largo entre os caracteres
  logoSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '400',
    marginTop: 12,
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  // Container arredondado externo do botão
  animatedWrapper: {
    width: '100%',
    borderRadius: 32,
    borderWidth: 1.5,
  },
  // Botão clicável de toque com cantos bastante arredondados e transições de borda
  buttonContainer: {
    borderColor: 'rgba(255, 255, 255, 0.35)',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  // Estilo de base de vidro para o gradiente
  glassBase: {
    borderRadius: 32,
  },
  // O raio luminoso (shimmer) com largura estática
  shimmerBeam: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 120,
  },
  // Estilo do texto do botão: cor branca, negrito, caixa alta implícita com espaçamento de letra
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 1,
  },
});