import React, { useEffect, useRef } from 'react';
import { Engine, Render, Bodies, World } from 'matter-js'
import { IMemory } from '../constants/interfaces';

interface Props {
  memories?: IMemory[];
}

function MemoryContainer(props: Props): React.ReactElement {
  const scene = useRef() as React.MutableRefObject<HTMLInputElement>;
  const engine = useRef(Engine.create());
  const isPressed = useRef(false);

  const handleDown = () => {
    isPressed.current = true
  }

  const handleUp = () => {
    isPressed.current = false
  }

  const handleAddCircle = e => {
    if (isPressed.current) {
      const ball = Bodies.circle(
        e.clientX,
        e.clientY,
        10 + Math.random() * 30,
        {
          mass: 10,
          restitution: 0.9,
          friction: 0.005,
          render: {
            fillStyle: '#0000ff'
          }
        })
      World.add(engine.current.world, [ball])
    }
  }

  useEffect(() => {
    initializeEngine(scene, engine);
    console.log('test');
  }, []);

  return (
    <div
      className='test123'
      onMouseDown={handleDown}
      onMouseUp={handleUp}
      onMouseMove={handleAddCircle}
    >
      <div ref={scene} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}

function initializeEngine(scene: any, engine:any) {
  // mount
  const cw = document.body.clientWidth
  const ch = document.body.clientHeight

  const render = Render.create({
    element: scene.current,
    engine: engine.current,
    options: {
      width: cw,
      height: ch,
      wireframes: false,
      background: 'transparent'
    }
  })
    
  // boundaries
  World.add(engine.current.world, [
    Bodies.rectangle(cw / 2, -10, cw, 20, { isStatic: true }),
    Bodies.rectangle(-10, ch / 2, 20, ch, { isStatic: true }),
    Bodies.rectangle(cw / 2, ch + 10, cw, 20, { isStatic: true }),
    Bodies.rectangle(cw + 10, ch / 2, 20, ch, { isStatic: true })
  ])
    
  // run the engine
  Engine.run(engine.current)
  Render.run(render)

  // unmount
  return () => {
    // destroy Matter
    Render.stop(render);
    World.clear(engine.current.world, false);
    Engine.clear(engine.current);
    render.canvas.remove();
    render.canvas = null;
    render.context = null;
    render.textures = {};
  }
}

export default MemoryContainer;