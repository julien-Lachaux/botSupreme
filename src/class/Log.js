import clc    from 'cli-color'
import cli    from 'pixl-cli'
import figures from 'figures'

export const Log = {

    checkMark:   clc.green(figures.tick),
    crossMark:   clc.red(figures.cross),
    warningMark: clc.yellow(figures.warning),
    noticeMark:  clc.cyan(figures.circleQuestionMark),

    init() {
        cli.global()
    },

    print(message, newLine = true, standardOutput = true) {
        let lineEnd = newLine ? "\n" : ""
        
        if (standardOutput) {
            print(message + lineEnd)
        } else {
            warn(message + lineEnd)
        }
    },

    title(title, blankLineBefore = true) {
        if (blankLineBefore) {
            this.blankLine()
        }
        cli.print(cli.box(title))
        this.blankLine()
    },

    blankLine() {
        this.print('')
    },

    success(message, newLine, markAtEndOfLine = true) {
        message = markAtEndOfLine ? ( clc.green(message) + ' ' + this.checkMark ) : ( this.checkMark + ' ' + clc.green(message) )
        this.print(message, newLine)
    },

    error(message, newLine, markAtEndOfLine = true) {
        message = markAtEndOfLine ? ( clc.red.bold(message) + ' ' + this.crossMark ) : ( this.crossMark + ' ' + clc.red.bold(message) )
        this.print(message, newLine, false)
    },

    warning(message, newLine, markAtEndOfLine = true) {
        message = markAtEndOfLine ? ( clc.yellow(message) + ' ' + this.warningMark ) : ( this.warningMark + ' ' + clc.yellow(message) )
        this.print(message, newLine)
    },

    notice(message, newLine, markAtEndOfLine = true) {
        message = markAtEndOfLine ? ( clc.cyan(message) + ' ' + this.noticeMark ) : ( this.noticeMark + ' ' + clc.cyan(message) )
        this.print(message, newLine)
    }

}