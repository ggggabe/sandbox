/* * This file assumes browser executed paperjs
 *
 * * * * * * * * * * * * * * * * * * * * * * * */


// R2 u [0, 1] -> R2
const PointHomotopy = ( a, b, t ) => {
  return (a.multiply(t)).add(b.multiply(1 - t))
}

// R1 u [0, 1] -> R1
const RHomotopy = (a, b, t) => {
  return a * (t) + b * (1 - t)
}


const pointHomotopy = (p1, p2, fnx, fny, t) => {
  with (paper) {
    return new Point(
      homotopy(
        [p1.x, p2.x],
        [0, 1],
        fnx,
        t
      ), homotopy(
        [p1.y, p2.y],
        [0, 1],
        fny,
        t
      )
    )
  }
}

function makeCircle(center) {

  with(paper){
    const path = new Path.Circle({
      center,
      radius: 30,
    })

    path.center = center

    path.animate = ({count}) => {
      const point1 = new Point(0,0)
      const point2 = new Point(
        RHomotopy(
          new Point([view.bounds.x, 0]),
          new Point([-1, 1]),
          Math.sin(count*.2)
        ),
        0
      )

      path.position = path.center.add(point2)
    }

    return path
  }
}


function makeIntersection(center) {
  with (paper) {
    const { x, y , width, height } = view.bounds

    return [
      new Point(
        RHomotopy(
          new Point([x, x + width]),
          new Point([0, 1]),
          Math.random()
        ), RHomotopy(
          new Point([y, y + height]),
          new Point([0, 1]),
          () => Math.random()
        )
      ), new Point(
        RHomotopy(
          new Point([x, x + width]),
          new Point([0, 1]),
          Math.random()
        ), RHomotopy(
          new Point([y, y + height]),
          new Point([0, 1]),
          Math.random()
        ))
    ].map(
      point => new Path.Line({
        from: center.add(point),
        to:  center.add(point).transform(
          new Matrix(-1, 0, 0, -1, 0, 0)
        ),
        strokeColor: 'black'
      })
    )
  }
}


window.onload = function() {
  console.log('hello')

  paper.setup('triangles')

  with (paper) {
    const { _width, _height } = view.viewSize
    // Define a random point in the view, which we will be moving
    // the text item towards.
    // // {x: 50, y: 25} and a size of {width: 50, height: 50}
    view.center = new Point(0, 0)

    const bg = new Shape.Rectangle({
      rectangle: view.bounds,
      fillColor: 'rgba(79, 86, 168, .3)'
    })

    const c2 = makeCircle(new Point(10,10))
    const c1 = makeCircle(new Point(0,0))
    c2.fillColor = 'rgba(79,86, 168, .5)'
    c1.fillColor = 'hsl(235deg, 36%, 46%)'
    const c3 = makeCircle(new Point(0, 0))
    c3.fillColor = 'red'
    c3.size = 5


    const intersection = makeIntersection(view.center)

    view.onMouseMove = ({point}) => {
      c2.position = point
      c1.position = point.transform(new Matrix(-1,0,0,-1,0,0))
    }


    view.onFrame = ({count}) => {
      const amp = count* (Math.PI/6) * .2

      c3.position = PointHomotopy(
        new Point(c1.position.y, -c1.position.x),
        new Point(-c1.position.y, c1.position.x),
        (Math.cos(Math.PI * amp * .2) + 1)/2
      ).add(
        PointHomotopy(c1.position, c2.position, (Math.sin(amp * .2) + 1)/2)
      )

    }
  }
}
