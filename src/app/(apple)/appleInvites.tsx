// Importa o componente Marquee para rolagem contínua horizontal
import { Marquee } from '@animatereactnative/marquee';
// Importa o componente Stagger para animações com atraso em cascata nos textos
import { Stagger } from '@animatereactnative/stagger';
// Importa o hook useState do React para controle de estado local
import { useState } from 'react';
// Importa componentes estruturais, utilitários de estilo e dimensões da tela do React Native
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
// Importa Reanimated e suas funções auxiliares para manipulação de animações de alto desempenho
import Animated, { Easing, FadeIn, FadeInUp, interpolate, SharedValue, useAnimatedReaction, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
// Importa o utilitário runOnJS para disparar funções da thread JS de dentro de uma worklet (thread de UI)
import { runOnJS } from 'react-native-worklets';

// Lista de URLs de imagens usadas no carrossel de convites
const images = [
  "https://i.pinimg.com/736x/90/6c/4b/906c4bb3739246629ea24ad85cbc9acd.jpg",
  "https://i.pinimg.com/736x/be/78/39/be7839ce8a71b0661088035c445f534c.jpg",
  "https://i.pinimg.com/1200x/bd/c6/3b/bdc63bd3dea2b5d8b06223ef4ea75567.jpg",
  "https://i.pinimg.com/736x/d6/6b/5c/d66b5cc5b3fb7f2341e3f33a01e2e994.jpg",
  "https://i.pinimg.com/1200x/96/92/4d/96924dcbbc1ed8612e5d93c46facff2d.jpg",
  "https://i.pinimg.com/736x/04/1e/96/041e9638826d00a538bcd15872187a66.jpg",
  "https://i.pinimg.com/1200x/35/f6/67/35f667c9f95fcbcf6b3433bed283f261.jpg",
  "https://i.pinimg.com/736x/d1/40/b7/d140b73537908595614e9f6d7ce0e8f1.jpg",
  "https://i.pinimg.com/1200x/93/fe/b7/93feb744d818618ebe2cc114bd8296b6.jpg"
]

// Obtém a largura da janela do dispositivo
const { width } = Dimensions.get('window');
// Define a largura de cada item (62% da largura da tela)
const _itemWidth = width * .62;
// Define a altura proporcional ao item (proporção de 1.67)
const _itemHeight = _itemWidth * 1.67;
// Define o espaçamento horizontal entre as imagens (16 pixels)
const _spacing = 16;
// Define o tamanho ocupado por cada item somando sua largura e o espaçamento
const _itemSize = _itemWidth + _spacing;

// Componente representativo de cada item de imagem na lista
const Item = ({ image, index, offset }: { image: string; index: number; offset: SharedValue<number> }) => {

  // Define os estilos animados aplicados a cada item usando reanimated
  const _stylez = useAnimatedStyle(() => {
    // 1. A distância física exata necessária antes que a sequência se repita perfeitamente
    const totalSize = images.length * _itemSize;

    // 2. Move o limite para que o recálculo do loop aconteça fora da tela visível
    const shift = width + _itemSize;

    // 3. Função de módulo segura para worklets, evitando erros do JS com números negativos
    const safeModulo = (val: number, mod: number) => {
      'worklet';
      return ((val % mod) + mod) % mod;
    };

    // 4. Calcula a posição exata em pixels do item mapeada para a tela
    const itemPosition = index * _itemSize;
    // Realiza o cálculo do módulo seguro aplicando o offset de rolagem
    const range = safeModulo(itemPosition - offset.value + shift, totalSize) - shift;

    // Retorna uma transformação de rotação dinâmica baseada na posição do item na tela
    return {
      transform: [{
        rotate: `${interpolate(
          range,
          [-_itemSize, (width - _itemSize) / 2, width], // Intervalo de entrada (da esquerda, centro ao lado direito da tela)
          [-5, 0, 5], // Rotação correspondente em graus (-5° na esquerda, 0° no centro, 5° na direita)
          'clamp' // Limita a rotação máxima e mínima para não extrapolar o intervalo de graus
        )}deg`
      }]
    }
  });

  return (
    // Componente de View animada que recebe os estilos estáticos e dinâmicos de rotação
    <Animated.View style={[styles.item, _stylez]}>
      {/* Componente de imagem nativa que preenche o container com bordas arredondadas */}
      <Image source={{ uri: image }} style={styles.itemImage} />
    </Animated.View>
  )
}

// Componente principal de animação dos Convites Apple
export default function AppleInvites() {
  // Cria uma variável de valor compartilhado para controlar o deslocamento horizontal do carrossel
  const offset = useSharedValue(0);
  // Define o estado local para armazenar o índice do slide centralizado atual
  const [activeIndex, setActiveIndex] = useState(0);

  // Escuta as alterações na variável compartilhada offset da rolagem e reage atualizando o índice ativo
  useAnimatedReaction(
    () => {
      // Calcula o índice fracionário do carrossel considerando o centro da tela
      const floatIndex = ((offset.value + width / 2) / _itemSize) % images.length;
      // Retorna o valor absoluto arredondado para baixo do índice correspondente à imagem centralizada
      return Math.abs(Math.floor(floatIndex));
    },
    (value) => {
      // Dispara a atualização do estado React na thread principal do JS
      runOnJS(setActiveIndex)(value);
    }
  );

  return (
    // Container principal de tela inteira
    <View style={styles.container}>

      {/* Container de fundo para exibição do efeito de background desfocado */}
      <View style={styles.backgroundContainer}>
        {/* Imagem desfocada de fundo que muda de acordo com o index ativo */}
        <Animated.Image
          key={`image-${activeIndex}`} // Chave dinâmica para forçar a renderização e animação de transição ao mudar de imagem
          source={{ uri: images[activeIndex] }}
          style={styles.backgroundImage}
          blurRadius={50} // Define o nível de desfoque de fundo
          entering={FadeIn.duration(1000)} // Efeito de entrada suave da nova imagem (1 segundo de duração)
          exiting={FadeIn.duration(1000)} // Efeito de saída suave da imagem anterior (1 segundo de duração)
        />
      </View>

      {/* Componente de rolagem contínua automática (Marquee) */}
      <Marquee spacing={_spacing} position={offset}>
        {/* View animada que encapsula a linha horizontal de imagens */}
        <Animated.View
          style={styles.marqueeContent}
          entering={FadeInUp.delay(500) // Animação de entrada vinda de cima
            .duration(1000) // Duração de 1 segundo
            .easing(Easing.elastic(0.9)) // Efeito elástico suave na descida
            .withInitialValues({
              transform: [{ translateY: - _itemHeight / 2 }], // Define a posição inicial acima da tela
            })}
        >
          {/* Mapeia o array de imagens gerando cada componente de imagem individual (Item) */}
          {images.map((image, index) => (
            <Item key={`image-${index}`} image={image} index={index}
              offset={offset} />
          ))}
        </Animated.View>
      </Marquee>

      {/* Componente Stagger para animar sequencialmente a entrada dos textos informativos */}
      <Stagger
        initialEnteringDelay={1000} // Atraso de 1 segundo antes de iniciar a cascata
        duration={500} // Duração da animação de cada texto individual
        stagger={100} // Atraso de 100ms entre a entrada de cada parágrafo
        style={styles.stagger}>
        {/* Texto 1: Subtítulo de boas-vindas */}
        <Text style={styles.welcomeText}>
          Welcome to
        </Text>
        {/* Texto 2: Título principal destacado */}
        <Text style={styles.titleText}>
          Apple Invites Animation!
        </Text>
        {/* Texto 3: Descrição sobre o funcionamento da animação */}
        <Text style={styles.descriptionText}>
          This is a simple animation that uses the Marquee and Stagger components from the Animate React Native library.
        </Text>
      </Stagger>
    </View>
  )
}

// Criação do objeto de folhas de estilo otimizado (StyleSheet)
const styles = StyleSheet.create({
  // Estilo do container raiz: ocupa a tela inteira, centraliza itens e define cor de fundo preta
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#000',
  },
  // Estilo do container de fundo: posicionamento absoluto preenchendo toda a tela e opacidade reduzida
  backgroundContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
  },
  // Estilo da imagem de fundo: preenche todo o espaço disponível
  backgroundImage: {
    flex: 1,
  },
  // Estilo de dimensões estáticas para cada item da lista (definido por constantes calculadas)
  item: {
    width: _itemWidth,
    height: _itemHeight,
  },
  // Estilo da imagem do item: preenche o container do item e arredonda as bordas
  itemImage: {
    flex: 1,
    borderRadius: 16,
  },
  // Estilo da linha horizontal de imagens no Marquee
  marqueeContent: {
    flexDirection: 'row',
    gap: _spacing,
  },
  // Estilo do container do Stagger: metade da área inferior da tela, centralizado
  stagger: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Estilo do subtítulo de boas-vindas: cor branca com 60% de opacidade e espessura média (evita conflito com animação de layout do Stagger)
  welcomeText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },
  // Estilo do título principal: cor branca com 90% de opacidade, negrito, fonte grande e margem inferior (evita conflito com animação de layout do Stagger)
  titleText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: 'bold',
    fontSize: 28,
    marginBottom: 16,
  },
  // Estilo do parágrafo explicativo: texto centralizado, margens laterais e cor branca com 60% de opacidade (evita conflito com animação de layout do Stagger)
  descriptionText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});
